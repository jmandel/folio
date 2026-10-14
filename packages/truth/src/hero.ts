// The hero, Linda Okafor, encoded by hand from truth/HERO.md and the Stage 0 examples.
// Values HERO.md does not give (routine visit vitals, extra inpatient panels, home readings) are
// chosen here and listed in packages/truth/README.md.

import { conditionCoding, ingredientCoding } from "./catalog.ts";
import { finalize, type LabIn, type PatientIn } from "./finalize.ts";
import {
  addDays, at, type Condition, type Encounter, type HomeLogPlan, type LabDraw, type Medication, type NarrativeFact,
  type Patient, type Vital,
} from "./model.ts";
import { Rng } from "./rng.ts";

const T = (local: string) => at(local);

/** UTC instant expressed in Chicago time. */
const U = (utc: string) => {
  const d = new Date(utc);
  const local = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(d).replace(" ", "T");
  return at(local);
};


// ─── Conditions ─────────────────────────────────────────────────────────────────────────────────

const conditions: Condition[] = [
  {
    id: "c_htn", name: "Essential hypertension", coding: conditionCoding("htn"), onset: "2014",
    history: [{ at: "2019-03-18", status: "active", recordedBy: "B" }, { at: T("2026-07-13T10:30"), status: "active", recordedBy: "C", icd10: "I12.9" }],
    visibility: { A: "both", B: "both", C: "both" }, traps: ["T10", "T17"],
  },
  {
    id: "c_t2dm", name: "Type 2 diabetes mellitus", coding: conditionCoding("t2dm"), onset: "2016",
    history: [{ at: "2019-03-18", status: "active", recordedBy: "B" }, { at: T("2026-07-13T10:30"), status: "active", recordedBy: "C", icd10: "E11.22" }],
    visibility: { A: "both", B: "both", C: "both" }, traps: ["T10", "T17"],
  },
  {
    id: "c_hld", name: "Hyperlipidemia", coding: conditionCoding("hld"), onset: "2017",
    history: [{ at: "2019-03-18", status: "active", recordedBy: "B" }],
    visibility: { A: "both", B: "structured" },
  },
  {
    id: "c_mdd", name: "Major depressive disorder, recurrent, mild", coding: conditionCoding("mdd"), onset: "2019",
    history: [{ at: "2019-09-16", status: "active", recordedBy: "B" }],
    sensitive: "behavioral-health", visibility: { A: "both", B: "structured" }, traps: ["T19"],
  },
  {
    id: "c_ckd", name: "Chronic kidney disease", coding: conditionCoding("ckd3a"), onset: "2022-02-07",
    history: [
      { at: "2022-02-07", status: "active", stage: "3a", recordedBy: "B", icd10: "N18.31", snomed: "700378005" },
      { at: T("2026-07-13T10:30"), status: "active", stage: "3b A3", recordedBy: "C", icd10: "N18.32", snomed: "700379002" },
    ],
    visibility: { A: "both", B: "both", C: "both" }, traps: ["T5", "T11"],
  },
  {
    id: "c_dka", name: "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated", coding: conditionCoding("dka"), onset: "2024-11-01",
    history: [
      { at: U("2024-11-02T02:40Z"), status: "active", recordedBy: "A", label: "Diabetic ketoacidosis, euglycemic", doc: "ed" },
      { at: U("2024-11-02T07:15Z"), status: "active", recordedBy: "A", label: "Euglycemic DKA, SGLT2 inhibitor-associated", subtype: "sglt2i", doc: "hp" },
      { at: U("2024-11-03T16:20Z"), status: "resolved", recordedBy: "A", doc: "consult" },
      { at: U("2024-11-05T17:30Z"), status: "resolved", recordedBy: "A", doc: "dc" },
      { at: T("2026-07-13T10:30"), status: "resolved", recordedBy: "C", icd10: "Z86.39" },
    ],
    visibility: { A: "both", B: "prose", C: "both" }, traps: ["T18"],
  },
  {
    id: "c_panc", name: "Acute pancreatitis", coding: conditionCoding("pancreatitis"), onset: "2024-11-01",
    history: [
      { at: U("2024-11-02T02:40Z"), status: "working", recordedBy: "A", label: "R/O pancreatitis", doc: "ed" },
      { at: U("2024-11-02T07:15Z"), status: "ruled-out", recordedBy: "A", label: "Acute pancreatitis", doc: "hp" },
    ],
    visibility: { A: "both" }, traps: ["T12"],
  },
  {
    id: "c_na", name: "Hyponatremia", coding: conditionCoding("hyponatremia"), onset: "2024-11-01",
    history: [
      { at: U("2024-11-02T02:40Z"), status: "active", recordedBy: "A", doc: "ed" },
      { at: T("2026-07-13T10:30"), status: "active", recordedBy: "C" },
    ],
    visibility: { A: "both", C: "both" },
  },
];

// ─── Medications ────────────────────────────────────────────────────────────────────────────────

const med = (m: Omit<Medication, "rxnorm"> & { rxnorm?: Medication["rxnorm"] }): Medication => ({ ...m, rxnorm: m.rxnorm ?? ingredientCoding(m.product) });

const meds: Medication[] = [
  med({
    id: "m_metformin", product: "metformin-1000", doseText: "1000 mg", dose: { value: 1000, unit: "mg" }, frequency: "BID",
    history: [
      { at: "2016", status: "active", by: "B" },
      { at: U("2024-11-02T07:15Z"), status: "held", by: "A", doc: "hp", restartAdvice: "resume_when_able", instructions: "Hold while acidotic and NPO", intendResume: true },
      { at: U("2024-11-03T16:20Z"), status: "held", by: "A", doc: "consult", restartAdvice: "resume_when_able", instructions: "May resume when eating and creatinine stable", intendResume: true },
      { at: U("2024-11-05T17:30Z"), status: "active", by: "A", doc: "dc" },
      { at: T("2026-02-11T14:20"), status: "active", by: "B", product: "metformin-500", dose: { value: 500, unit: "mg" }, doseText: "500 mg", frequency: "BID", reason: "eGFR 41" },
    ],
    visibility: { A: "both", B: "both", C: "prose", P: "structured" }, traps: ["T15"],
  }),
  med({
    id: "m_lisinopril", product: "lisinopril-20", doseText: "20 mg", dose: { value: 20, unit: "mg" }, frequency: "QD",
    history: [
      { at: "2017", status: "active", by: "B" },
      { at: T("2021-06-03T10:32"), status: "stopped", by: "B", stopReason: "adverse_reaction", reason: "dry cough" },
    ],
    visibility: { B: "both", P: "structured" }, traps: ["T12"],
  }),
  med({
    id: "m_losartan", product: "losartan-50", doseText: "50 mg", dose: { value: 50, unit: "mg" }, frequency: "QD",
    history: [
      { at: T("2021-06-03T10:33"), status: "active", by: "B", reason: "ACE inhibitor cough" },
      { at: U("2024-11-02T07:15Z"), status: "held", by: "A", doc: "hp", restartAdvice: "resume_when_able", instructions: "Hold for volume depletion; resume when eating and creatinine at baseline", intendResume: true },
      { at: U("2024-11-05T17:30Z"), status: "active", by: "A", doc: "dc" },
      { at: T("2025-08-18T09:48"), status: "active", by: "B", product: "losartan-100", dose: { value: 100, unit: "mg" }, doseText: "100 mg", frequency: "QD", reason: "BP above goal with albuminuria" },
    ],
    visibility: { A: "both", B: "both", C: "prose", P: "structured" },
  }),
  med({
    id: "m_chlorthalidone", product: "chlorthalidone-25", doseText: "12.5 mg", dose: { value: 12.5, unit: "mg" }, frequency: "QD",
    history: [
      { at: T("2022-05-16T10:05"), status: "active", by: "B", reason: "BP above goal" },
      { at: U("2024-11-02T07:15Z"), status: "held", by: "A", doc: "hp", restartAdvice: "resume_when_able", instructions: "Hold for hyponatremia and volume depletion", intendResume: true },
      { at: U("2024-11-05T17:30Z"), status: "active", by: "A", doc: "dc" },
    ],
    visibility: { A: "both", B: "both", C: "prose", P: "structured" },
  }),
  med({
    id: "m_atorvastatin", product: "atorvastatin-40", doseText: "40 mg", dose: { value: 40, unit: "mg" }, frequency: "QHS",
    history: [
      { at: "2018", status: "active", by: "B" },
      { at: U("2024-11-02T07:15Z"), status: "active", by: "A", doc: "hp" },
    ],
    visibility: { A: "both", B: "both", P: "structured" }, traps: ["T4"],
  }),
  med({
    id: "m_sertraline", product: "sertraline-100", doseText: "100 mg", dose: { value: 100, unit: "mg" }, frequency: "QD",
    history: [
      { at: T("2019-09-16T10:20"), status: "active", by: "B", reason: "depression" },
      { at: U("2024-11-02T07:15Z"), status: "active", by: "A", doc: "hp" },
    ],
    sensitive: "behavioral-health", visibility: { A: "both", B: "structured", C: "prose", P: "structured" }, traps: ["T19", "T15"],
  }),
  med({
    id: "m_empagliflozin", product: "empagliflozin-10", doseText: "10 mg", dose: { value: 10, unit: "mg" }, frequency: "QD",
    history: [
      { at: T("2023-03-06T10:15"), status: "active", by: "B", reason: "CKD + DM, cardiorenal benefit" },
      { at: U("2024-11-02T07:15Z"), status: "held", by: "A", doc: "hp" },
      { at: U("2024-11-03T16:20Z"), status: "held", by: "A", doc: "consult", restartAdvice: "advise_against", instructions: "Recommend against restarting at discharge" },
      { at: U("2024-11-05T17:30Z"), status: "held", by: "A", doc: "dc", restartAdvice: "advise_against", instructions: "Do not resume until reviewed by PCP", intendResume: false },
      { at: T("2024-11-12T09:52"), status: "stopped", by: "B", stopReason: "adverse_reaction", reason: "euglycemic DKA" },
    ],
    visibility: { A: "both", B: "both", C: "prose", P: "both" }, traps: ["T1", "T18"],
  }),
  med({
    id: "m_glargine", product: "glargine-100", doseText: "10 units", dose: { value: 10, unit: "units" }, frequency: "QHS",
    history: [
      { at: T("2025-08-18T09:50"), status: "active", by: "B", reason: "A1c 8.6" },
      { at: "2025-10", status: "active", by: "P", takenAs: "10 units at bedtime, 12 if my sugar was over 200 that day" },
    ],
    visibility: { B: "both", C: "prose", P: "both" }, traps: ["T13"],
  }),
  med({
    id: "m_atorvastatin80", product: "atorvastatin-80", doseText: "80 mg", dose: { value: 80, unit: "mg" }, frequency: "QHS",
    history: [
      { at: T("2025-11-03T15:42"), status: "active", by: "B" },
      { at: T("2025-11-04T08:47:55"), status: "entered-in-error", by: "B", reason: "wrong patient" },
    ],
    visibility: { B: "structured" }, traps: ["T4"],
  }),
  med({
    id: "m_finerenone", product: "finerenone-10", doseText: "10 mg", dose: { value: 10, unit: "mg" }, frequency: "QD", prescriber: "C",
    history: [
      { at: T("2026-07-13T10:30"), status: "active", by: "C", reason: "albuminuria persists on maximum ARB" },
      { at: T("2026-09-14T16:31"), status: "held", by: "C", reason: "K 5.8 / 5.7 confirmed", intendResume: true, reviewOn: "2026-09-28" },
    ],
    laggingLines: [{ source: "B", showsStatus: "active", since: T("2026-07-20T11:12") }],
    visibility: { B: "both", C: "both" }, traps: ["T1", "T16"],
  }),
  med({
    id: "m_ibuprofen", product: "ibuprofen-200", doseText: "400 mg (2 × 200 mg)", dose: { value: 400, unit: "mg" }, frequency: "PRN", otc: true,
    history: [{ at: "2025", status: "active", by: "P", takenAs: "2 when my knee acts up, maybe twice a week" }],
    visibility: { P: "structured" }, traps: ["T13"],
  }),
  // Hospital-only orders during the 2024 stay.
  med({ id: "i_lr", product: "fluid-lr", orderName: "lactated Ringer's", setting: "inpatient", route: "IV", doseText: "1000 mL bolus", frequency: "QD",
    history: [{ at: U("2024-11-02T03:10Z"), status: "active", by: "A" }, { at: U("2024-11-02T03:55Z"), status: "stopped", by: "A" }], visibility: { A: "both" } }),
  med({ id: "i_insulin", product: "regular-insulin", orderName: "insulin regular (human) IV infusion", setting: "inpatient", route: "IV", doseText: "per DKA protocol, 0.1 units/kg/h", frequency: "QD",
    history: [{ at: U("2024-11-02T04:05Z"), status: "active", by: "A" }, { at: U("2024-11-03T15:00Z"), status: "stopped", by: "A" }], visibility: { A: "both" } }),
  med({ id: "i_d5lr", product: "fluid-d5lr", orderName: "dextrose 5% in lactated Ringer's", setting: "inpatient", route: "IV", doseText: "150 mL/h", frequency: "QD",
    history: [{ at: U("2024-11-02T04:05Z"), status: "active", by: "A" }, { at: U("2024-11-03T15:00Z"), status: "stopped", by: "A" }], visibility: { A: "both" } }),
  med({ id: "i_glargine", product: "glargine-100", orderName: "insulin glargine", setting: "inpatient", route: "SubQ", doseText: "14 units daily", frequency: "QD",
    history: [{ at: U("2024-11-03T13:00Z"), status: "active", by: "A" }, { at: U("2024-11-05T14:00Z"), status: "stopped", by: "A" }], visibility: { A: "both" } }),
  med({ id: "i_lispro", product: "lispro-100", orderName: "insulin lispro correction scale", setting: "inpatient", route: "SubQ", doseText: "low-dose correction scale before meals", frequency: "TID",
    history: [{ at: U("2024-11-03T15:00Z"), status: "active", by: "A" }, { at: U("2024-11-05T14:00Z"), status: "stopped", by: "A" }], visibility: { A: "both" } }),
];

// ─── Labs ───────────────────────────────────────────────────────────────────────────────────────

const draws: LabDraw[] = [];
const labs: LabIn[] = [];
const C_DRAW = (id: string, local: string, received: string | undefined, fasting: "Y" | "N" | "U", orderedBy: "B" | "C") =>
  draws.push({ id, collectedAt: T(local), receivedAt: received ? T(received) : undefined, fasting, orderedBy, orderingClinician: orderedBy === "B" ? "ngf:treyes" : "lv:marsh", performedBy: "C", setting: "outpatient" });
const A_DRAW = (id: string, utc: string, setting: "ed" | "inpatient") =>
  draws.push({ id, collectedAt: U(utc), orderedBy: "A", performedBy: "A", setting });
const lab = (id: string, analyte: LabIn["analyte"], draw: string, value: number, extra: Partial<LabIn> = {}) =>
  labs.push({ id, analyte, draw, value, ...extra });

C_DRAW("d_2021_01_14", "2021-01-14T07:52", "2021-01-14T09:10", "Y", "B");
lab("l_2021_01_14_cr", "creatinine", "d_2021_01_14", 0.98, { resultedAt: T("2021-01-14T11:02") });
lab("l_2021_01_14_a1c", "a1c", "d_2021_01_14", 7.4, { resultedAt: T("2021-01-14T13:15") });

C_DRAW("d_2021_09_20", "2021-09-20T08:14", "2021-09-20T09:22", "U", "B");
lab("l_2021_09_20_cr", "creatinine", "d_2021_09_20", 1.12, { resultedAt: T("2021-09-20T14:51") });

C_DRAW("d_2022_02_07", "2022-02-07T08:20", "2022-02-07T09:35", "Y", "B");
lab("l_2022_02_07_cr", "creatinine", "d_2022_02_07", 1.18, { resultedAt: T("2022-02-07T11:40") });
lab("l_2022_02_07_uacr", "uacr", "d_2022_02_07", 85, { resultedAt: T("2022-02-07T15:10") });

C_DRAW("d_2022_09_12a", "2022-09-12T08:05", "2022-09-12T09:31", "U", "B");
lab("l_2022_09_12_k1", "potassium", "d_2022_09_12a", 6.1, {
  status: "corrected-away", replacedBy: "l_2022_09_12_k2", annotations: ["hemolyzed"],
  resultedAt: T("2022-09-12T11:40"), correctedAt: T("2022-09-12T15:05"), traps: ["T2", "T3"],
});
C_DRAW("d_2022_09_12b", "2022-09-12T13:20", "2022-09-12T13:52", "U", "B");
lab("l_2022_09_12_k2", "potassium", "d_2022_09_12b", 4.6, { resultedAt: T("2022-09-12T14:58"), traps: ["T3"] });

C_DRAW("d_2023_03_06", "2023-03-06T08:02", "2023-03-06T09:15", "Y", "B");
lab("l_2023_03_06_cr", "creatinine", "d_2023_03_06", 1.28, { resultedAt: T("2023-03-06T11:20") });
lab("l_2023_03_06_a1c", "a1c", "d_2023_03_06", 7.9, { resultedAt: T("2023-03-06T12:45") });

C_DRAW("d_2025_02_17", "2025-02-17T07:48", "2025-02-17T08:40", "Y", "B");
lab("l_2025_02_17_chol", "cholesterol", "d_2025_02_17", 168, { resultedAt: T("2025-02-17T10:35") });
lab("l_2025_02_17_tg", "triglycerides", "d_2025_02_17", 140, { resultedAt: T("2025-02-17T10:35") });
lab("l_2025_02_17_hdl", "hdl", "d_2025_02_17", 48, { resultedAt: T("2025-02-17T10:35") });
lab("l_2025_02_17_ldl", "ldl", "d_2025_02_17", 92, { resultedAt: T("2025-02-17T10:35"), derivedFrom: ["l_2025_02_17_chol", "l_2025_02_17_hdl", "l_2025_02_17_tg"] });

C_DRAW("d_2025_08_18", "2025-08-18T08:31", "2025-08-18T09:48", "N", "B");
lab("l_2025_08_18_a1c", "a1c", "d_2025_08_18", 8.6, { resultedAt: T("2025-08-18T11:20") });
lab("l_2025_08_18_a1c_dup", "a1c", "d_2025_08_18", 8.6, { status: "entered-in-error", duplicateOf: "l_2025_08_18_a1c", resultedAt: T("2025-08-18T11:20"), correctedAt: T("2025-08-18T12:41"), traps: ["T4"] });
lab("l_2025_08_18_wbc", "wbc", "d_2025_08_18", 6.8, { resultedAt: T("2025-08-18T10:12"), traps: ["T7"] });
lab("l_2025_08_18_hgb", "hemoglobin", "d_2025_08_18", 12.1, { resultedAt: T("2025-08-18T10:12") });
lab("l_2025_08_18_plt", "platelets", "d_2025_08_18", 212, { resultedAt: T("2025-08-18T10:12"), traps: ["T7"] });

C_DRAW("d_2026_02_09", "2026-02-09T08:14", "2026-02-09T09:25", "Y", "B");
lab("l_2026_02_09_cr", "creatinine", "d_2026_02_09", 1.45, { resultedAt: T("2026-02-09T11:06") });
lab("l_2026_02_09_na", "sodium", "d_2026_02_09", 132, { resultedAt: T("2026-02-09T11:06") });
lab("l_2026_02_09_k", "potassium", "d_2026_02_09", 4.6, { resultedAt: T("2026-02-09T11:06") });
lab("l_2026_02_09_uacr", "uacr", "d_2026_02_09", 320, { resultedAt: T("2026-02-09T15:33") });
lab("l_2026_02_09_a1c", "a1c", "d_2026_02_09", 8.2, { resultedAt: T("2026-02-09T12:52") });

C_DRAW("d_2026_08_10", "2026-08-10T08:25", "2026-08-10T09:05", "N", "C");
lab("l_2026_08_10_cr", "creatinine", "d_2026_08_10", 1.5, { resultedAt: T("2026-08-10T10:48") });
lab("l_2026_08_10_k", "potassium", "d_2026_08_10", 5.2, { resultedAt: T("2026-08-10T10:48") });

C_DRAW("d_2026_09_14a", "2026-09-14T08:40", "2026-09-14T09:15", "N", "C");
lab("l_2026_09_14_cr", "creatinine", "d_2026_09_14a", 1.52, { resultedAt: T("2026-09-14T10:55") });
lab("l_2026_09_14_k1", "potassium", "d_2026_09_14a", 5.8, { resultedAt: T("2026-09-14T10:55"), annotations: ["not hemolyzed"], traps: ["T3"] });
C_DRAW("d_2026_09_14b", "2026-09-14T13:05", "2026-09-14T13:40", "N", "C");
lab("l_2026_09_14_k2", "potassium", "d_2026_09_14b", 5.7, { confirms: "l_2026_09_14_k1", resultedAt: T("2026-09-14T15:05"), traps: ["T3"] });

// Riverside, 2024 stay. Daylight time ends 2024-11-03 02:00 (T10).
A_DRAW("d_rrh_ed", "2024-11-02T02:58Z", "ed");
const bmp = (prefix: string, draw: string, v: [number, number, number, number, number, number, number, number], resulted: string) => {
  const [na, k, cl, co2, ag, bun, cr, glu] = v;
  const r = { resultedAt: U(resulted) };
  lab(`${prefix}_na`, "sodium", draw, na, r); lab(`${prefix}_k`, "potassium", draw, k, r); lab(`${prefix}_cl`, "chloride", draw, cl, r);
  lab(`${prefix}_co2`, "bicarbonate", draw, co2, r); lab(`${prefix}_ag`, "anion-gap", draw, ag, r); lab(`${prefix}_bun`, "bun", draw, bun, r);
  lab(`${prefix}_cr`, "creatinine", draw, cr, r); lab(`${prefix}_glu`, "glucose", draw, glu, r);
};
bmp("l_rrh_ed", "d_rrh_ed", [129, 5.0, 94, 11, 24, 31, 1.41, 182], "2024-11-02T03:40Z");
lab("l_rrh_ed_ph", "ph", "d_rrh_ed", 7.21, { resultedAt: U("2024-11-02T03:08Z"), specimen: "venous-blood" });
lab("l_rrh_ed_pco2", "pco2", "d_rrh_ed", 28, { resultedAt: U("2024-11-02T03:08Z"), specimen: "venous-blood" });
lab("l_rrh_ed_bhb", "bhb", "d_rrh_ed", 6.2, { resultedAt: U("2024-11-02T04:20Z"), traps: ["T16"] });
lab("l_rrh_ed_trop", "troponin", "d_rrh_ed", 0.01, { comparator: "<", resultedAt: U("2024-11-02T03:45Z"), traps: ["T9"] });
lab("l_rrh_ed_lipase", "lipase", "d_rrh_ed", 28, { resultedAt: U("2024-11-02T06:35Z") });
lab("l_rrh_ed_wbc", "wbc", "d_rrh_ed", 14.2, { resultedAt: U("2024-11-02T03:30Z") });
lab("l_rrh_ed_hgb", "hemoglobin", "d_rrh_ed", 14.1, { resultedAt: U("2024-11-02T03:30Z") });
lab("l_rrh_ed_plt", "platelets", "d_rrh_ed", 268, { resultedAt: U("2024-11-02T03:30Z"), traps: ["T7"] });
A_DRAW("d_rrh_pm", "2024-11-02T17:05Z", "inpatient");
bmp("l_rrh_pm", "d_rrh_pm", [130, 4.6, 97, 15, 18, 27, 1.39, 156], "2024-11-02T17:50Z");
lab("l_rrh_pm_bhb", "bhb", "d_rrh_pm", 2.1, { resultedAt: U("2024-11-02T18:40Z") });
A_DRAW("d_rrh_d2", "2024-11-03T12:10Z", "inpatient");
bmp("l_rrh_d2", "d_rrh_d2", [131, 4.2, 99, 21, 11, 19, 1.36, 148], "2024-11-03T12:55Z");
lab("l_rrh_d2_bhb", "bhb", "d_rrh_d2", 0.3, { resultedAt: U("2024-11-03T14:10Z"), finalAt: U("2024-11-03T19:30Z"), traps: ["T14"] });
A_DRAW("d_rrh_d3", "2024-11-04T12:00Z", "inpatient");
bmp("l_rrh_d3", "d_rrh_d3", [132, 4.4, 100, 22, 10, 16, 1.35, 162], "2024-11-04T12:50Z");
A_DRAW("d_rrh_dc", "2024-11-05T12:00Z", "inpatient");
bmp("l_rrh_dc", "d_rrh_dc", [133, 4.3, 101, 23, 9, 14, 1.33, 136], "2024-11-05T12:45Z");

// ─── Allergies ──────────────────────────────────────────────────────────────────────────────────

const allergies: Patient["allergies"] = [
  {
    id: "a_lisinopril", substance: ingredientCoding("lisinopril-20")!, type: "intolerance", reaction: "dry cough",
    reactions: ["Cough"], criticality: "low", onset: "2021-04", recordedAt: T("2021-06-03T10:35"), recordedBy: "B",
    negatedFindings: ["angioedema", "lip, tongue or throat swelling"], visibility: { A: "structured", B: "both", P: "prose" }, traps: ["T12", "T18"],
  },
  {
    id: "a_empagliflozin", substance: ingredientCoding("empagliflozin-10")!, type: "adverse-reaction", reaction: "euglycemic diabetic ketoacidosis",
    reactions: ["Diabetic ketoacidosis"], criticality: "high", onset: "2024-11-01", recordedAt: T("2024-11-12T09:55"), recordedBy: "B",
    manifestation: "c_dka", visibility: { A: "structured", B: "both", P: "prose" }, traps: ["T18"],
  },
];

// ─── Narrative facts ────────────────────────────────────────────────────────────────────────────

const facts: NarrativeFact[] = [
  {
    id: "nf_precipitant", at: "2024-10-29", kind: "precipitant", polarity: "affirmed", about: ["c_dka"],
    statement: "The DKA was precipitated by a viral gastroenteritis (vomiting and loose stools from 10/29) with almost no food intake.",
    evidence: [["gastroenteritis|vomit|diarrh|loose stool|stomach bug|threw up"], ["intake|eat|food|nothing|crackers"]],
    span: { A: "precipitant" }, visibility: { A: "prose", P: "prose" }, traps: ["T13"],
  },
  {
    id: "nf_kept_taking", at: "2024-10-31", kind: "patient-report", polarity: "affirmed", about: ["m_empagliflozin"],
    statement: "She kept taking her pills, empagliflozin included, while she could not eat.",
    evidence: [["still taking|kept taking|keep taking"]], visibility: { P: "prose" }, traps: ["T13"],
  },
  {
    id: "nf_no_acs", at: U("2024-11-02T02:40Z"), kind: "rule-out", polarity: "negated",
    statement: "No evidence of acute coronary syndrome (troponin <0.01, ECG without ischemic changes).",
    evidence: [["no evidence of ACS|ACS (was )?(ruled out|excluded)|no (evidence of )?(acute coronary|ischemi)"]], visibility: { A: "prose" }, traps: ["T12"],
  },
  {
    id: "nf_no_angioedema", at: T("2021-06-03T10:35"), kind: "negation", polarity: "negated", about: ["a_lisinopril"],
    statement: "The lisinopril reaction was cough only: no lip, tongue or throat swelling.",
    evidence: [["no (lip|tongue|throat|facial)|no angioedema|without (angioedema|swelling)"]], visibility: { B: "prose" }, traps: ["T12"],
  },
  {
    id: "nf_sick_day", at: T("2024-11-12T09:30"), kind: "teaching", polarity: "affirmed",
    statement: "Sick-day rules were reviewed with her.", evidence: [["sick[- ]day"]], span: { B: "sick_day" },
    visibility: { B: "prose" }, traps: ["T13"],
  },
  {
    id: "nf_endo_advice", at: U("2024-11-03T16:20Z"), kind: "decision", polarity: "affirmed", about: ["m_empagliflozin"],
    statement: "Endocrinology advised against restarting any SGLT2 inhibitor at discharge.", evidence: [["SGLT2"]], visibility: { A: "prose" },
  },
  {
    id: "nf_sglt2_decision", at: T("2026-07-13T10:30"), kind: "decision", polarity: "affirmed", about: ["m_empagliflozin"],
    statement: "Not re-trying an SGLT2 inhibitor for now; revisit after her sick-day plan is proven.",
    evidence: [["SGLT2"], ["not|no "]], span: { C: "sglt2_decision" }, visibility: { C: "prose" }, traps: ["T13"],
  },
  {
    id: "nf_na_sertraline", at: T("2026-07-13T10:30"), kind: "context", polarity: "affirmed", about: ["c_na", "m_sertraline"],
    statement: "Sertraline (disclosed at intake) may contribute to the low sodium.", evidence: [["sertraline"]],
    span: { C: "na_sertraline" }, sensitive: "behavioral-health", visibility: { C: "prose" }, traps: ["T19"],
  },
  {
    id: "nf_glargine_selfadjust", at: "2025-10", kind: "patient-report", polarity: "affirmed", about: ["m_glargine"],
    statement: "She takes 12 units of glargine instead of 10 on days her glucose was over 200.",
    evidence: [["12"], ["200"]], visibility: { P: "prose" }, traps: ["T13"],
  },
  {
    id: "nf_knee", at: "2026-03-28", kind: "patient-report", polarity: "affirmed", about: ["m_ibuprofen"],
    statement: "Knee pain; she takes two Advil when it acts up.", evidence: [["knee"], ["advil|ibuprofen"]], visibility: { P: "prose" }, traps: ["T13"],
  },
];

// ─── Vitals ─────────────────────────────────────────────────────────────────────────────────────

const vitals: Vital[] = [
  { id: "v_rrh_ed", kind: "set", at: U("2024-11-02T02:46Z"), setting: "hospital", source: "A", bp: { systolic: 104, diastolic: 62 }, pulse: 118, resp: 28, tempF: 98.9, spo2: 98, weightKg: 84.0 },
  { id: "v_rrh_hp", kind: "set", at: U("2024-11-02T07:05Z"), setting: "hospital", source: "A", bp: { systolic: 112, diastolic: 68 }, pulse: 104, resp: 24, tempF: 98.6, spo2: 98, weightKg: 83.9 },
  { id: "v_rrh_d2", kind: "set", at: U("2024-11-03T13:20Z"), setting: "hospital", source: "A", bp: { systolic: 118, diastolic: 70 }, pulse: 92, resp: 18, tempF: 98.4, spo2: 98 },
  { id: "v_rrh_d3", kind: "set", at: U("2024-11-04T13:30Z"), setting: "hospital", source: "A", bp: { systolic: 126, diastolic: 74 }, pulse: 86, resp: 16, tempF: 98.3, spo2: 98, weightKg: 84.9 },
  { id: "v_rrh_dc", kind: "set", at: U("2024-11-05T14:10Z"), setting: "hospital", source: "A", bp: { systolic: 128, diastolic: 76 }, pulse: 84, resp: 16, tempF: 98.2, spo2: 98, weightKg: 85.2 },
  { id: "v_lv_2026_07_13", kind: "set", at: T("2026-07-13T10:34"), setting: "clinic", source: "C", bp: { systolic: 136, diastolic: 82 }, pulse: 78, weightKg: 86.2 },
];
const ngVitals: [string, string, number, number, number, number, [number, number]?][] = [
  // id, local time, sys, dia, pulse, weight lb, repeat
  ["2019-03-18", "2019-03-18T08:40", 146, 90, 80, 191.4],
  ["2019-09-16", "2019-09-16T09:50", 138, 86, 76, 189.0],
  ["2021-01-18", "2021-01-18T09:12", 140, 88, 78, 188.2],
  ["2021-06-03", "2021-06-03T10:10", 136, 84, 74, 187.6],
  ["2021-09-27", "2021-09-27T08:55", 138, 86, 76, 188.8],
  ["2022-05-16", "2022-05-16T09:40", 152, 94, 82, 190.0, [148, 92]],
  ["2023-03-06", "2023-03-06T09:45", 134, 82, 76, 189.6],
  ["2023-09-11", "2023-09-11T10:05", 132, 80, 74, 186.4],
  ["2024-04-15", "2024-04-15T08:50", 130, 80, 76, 187.0],
  ["2024-11-12", "2024-11-12T09:15", 124, 76, 80, 185.8],
  ["2025-02-17", "2025-02-17T09:20", 134, 82, 78, 188.0],
  ["2025-08-18", "2025-08-18T09:25", 146, 88, 76, 190.6, [142, 86]],
  ["2026-05-04", "2026-05-04T10:20", 138, 84, 74, 189.2],
];
for (const [d, t, sys, dia, pulse, lb, rep] of ngVitals) {
  vitals.push({
    id: `v_ng_${d.replaceAll("-", "_")}`, kind: "set", at: T(t), setting: "clinic", source: "B",
    bp: { systolic: sys, diastolic: dia }, bpRepeat: rep ? { systolic: rep[0], diastolic: rep[1] } : undefined,
    pulse, weightKg: Math.round(lb * 0.45359237 * 10) / 10, heightIn: d.endsWith("-03-18") || d === "2021-01-18" || d === "2024-04-15" ? 64 : undefined,
  });
}

// ─── Encounters ─────────────────────────────────────────────────────────────────────────────────

const ngVisit = (date: string, start: string, reason: string, addressed: string[], factIds: string[], extra: Partial<Encounter> = {}): Encounter => ({
  id: `e_ng_${date.replaceAll("-", "_")}`, source: "B", kind: "office", start: T(start), reason, clinician: "ngf:treyes",
  addressed: addressed.map((conditionId) => ({ conditionId })),
  documents: [{ key: "note", kind: "office-note", at: T(start), signedAt: T(start.slice(0, 11) + "12:10"), author: "ngf:treyes", factIds }],
  ...extra,
});

const encounters: Encounter[] = [
  ngVisit("2019-03-18", "2019-03-18T08:30", "New patient, establish care", ["c_htn", "c_t2dm", "c_hld"], ["c_htn", "c_t2dm", "c_hld", "m_metformin", "m_lisinopril", "m_atorvastatin", "v_ng_2019_03_18"]),
  ngVisit("2019-09-16", "2019-09-16T09:40", "Low mood", ["c_mdd", "c_t2dm"], ["c_mdd", "m_sertraline", "v_ng_2019_09_16"]),
  ngVisit("2021-01-18", "2021-01-18T09:00", "Annual exam", ["c_t2dm", "c_htn", "c_hld"], ["l_2021_01_14_a1c", "l_2021_01_14_cr", "v_ng_2021_01_18", "c_t2dm", "c_htn"],
    { billingExtra: [{ icd10: "Z00.00", display: "Encounter for general adult medical examination without abnormal findings" }] }),
  ngVisit("2021-06-03", "2021-06-03T10:00", "Cough", ["c_htn"], ["m_lisinopril", "m_losartan", "a_lisinopril", "nf_no_angioedema", "v_ng_2021_06_03"]),
  ngVisit("2021-09-27", "2021-09-27T08:45", "Lab follow-up", ["c_t2dm", "c_htn"], ["l_2021_09_20_cr", "l_2021_09_20_cr_egfr", "v_ng_2021_09_27"]),
  ngVisit("2022-05-16", "2022-05-16T09:30", "BP check", ["c_htn", "c_ckd"], ["v_ng_2022_05_16", "m_chlorthalidone", "c_htn"]),
  ngVisit("2023-03-06", "2023-03-06T09:35", "Diabetes follow-up", ["c_t2dm", "c_ckd"], ["l_2023_03_06_cr_egfr", "l_2023_03_06_a1c", "m_empagliflozin", "v_ng_2023_03_06"]),
  ngVisit("2023-09-11", "2023-09-11T09:55", "Diabetes follow-up", ["c_t2dm", "c_htn"], ["v_ng_2023_09_11", "c_t2dm", "c_htn"]),
  ngVisit("2024-04-15", "2024-04-15T08:40", "Annual exam", ["c_t2dm", "c_htn", "c_ckd"], ["v_ng_2024_04_15", "c_t2dm", "c_ckd"],
    { billingExtra: [{ icd10: "Z00.00", display: "Encounter for general adult medical examination without abnormal findings" }] }),
  ngVisit("2024-11-12", "2024-11-12T09:30", "Hosp f/u", ["c_t2dm", "c_ckd"], ["c_dka", "m_empagliflozin", "a_empagliflozin", "m_metformin", "m_chlorthalidone", "nf_sick_day"],
    { billingExtra: [{ icd10: "Z09", display: "Follow-up exam after completed treatment" }], addressed: [{ conditionId: "c_t2dm", icd10: "E11.22" }, { conditionId: "c_ckd" }] }),
  ngVisit("2025-02-17", "2025-02-17T09:10", "Diabetes follow-up", ["c_t2dm", "c_htn", "c_hld"], ["v_ng_2025_02_17", "c_t2dm", "l_2025_02_17_ldl", "m_atorvastatin"]),
  ngVisit("2025-08-18", "2025-08-18T09:15", "Diabetes follow-up", ["c_t2dm", "c_htn", "c_ckd"], ["l_2025_08_18_a1c", "m_glargine", "m_losartan", "v_ng_2025_08_18"]),
  ngVisit("2026-05-04", "2026-05-04T10:10", "Kidney function, referral", ["c_ckd", "c_t2dm", "c_htn"], ["l_2026_02_09_cr_egfr", "l_2026_02_09_uacr", "c_ckd", "c_dka", "m_empagliflozin", "v_ng_2026_05_04"],
    { reviewed: ["problems", "medications"] }),
  {
    id: "e_rrh_2024", source: "A", kind: "inpatient", start: U("2024-11-02T02:40Z"), admitted: U("2024-11-02T06:30Z"), end: U("2024-11-05T17:30Z"),
    disposition: "home", reason: "Vomiting, short of breath", clinician: "rrh:raman",
    documents: [
      {
        key: "ed", kind: "ed-note", at: U("2024-11-02T02:40Z"), signedAt: U("2024-11-02T06:10:12Z"), author: "rrh:hale",
        factIds: ["c_dka", "c_panc", "c_na", "m_empagliflozin", "nf_no_acs"],
        keys: { c_dka: "dx_dka", d_rrh_ed: "bmp", v_rrh_ed: "vs_1" },
        plan: [
          { kind: "vitals", vitalId: "v_rrh_ed" },
          { kind: "lab", panel: "BMP", key: "bmp", labIds: ["l_rrh_ed_na", "l_rrh_ed_k", "l_rrh_ed_cl", "l_rrh_ed_co2", "l_rrh_ed_ag", "l_rrh_ed_bun", "l_rrh_ed_cr", "l_rrh_ed_cr_egfr", "l_rrh_ed_glu"] },
          { kind: "lab", panel: "VBG", key: "vbg", labIds: ["l_rrh_ed_ph", "l_rrh_ed_pco2"] },
          { kind: "lab", key: "bhb", labIds: ["l_rrh_ed_bhb"] },
          { kind: "lab", key: "trop", labIds: ["l_rrh_ed_trop"] },
          { kind: "lab", panel: "CBC", key: "cbc", labIds: ["l_rrh_ed_wbc", "l_rrh_ed_hgb", "l_rrh_ed_plt"] },
          { kind: "dx", conditionId: "c_dka" }, { kind: "dx", conditionId: "c_panc" }, { kind: "dx", conditionId: "c_na" },
          { kind: "inpatient-med", medId: "i_lr" }, { kind: "inpatient-med", medId: "i_insulin" },
          { kind: "allergies" }, { kind: "home-meds" },
        ],
      },
      {
        key: "hp", kind: "h&p", at: U("2024-11-02T07:15Z"), signedAt: U("2024-11-02T09:02:44Z"), author: "rrh:raman",
        factIds: ["nf_precipitant", "c_dka", "c_panc", "c_na", "m_empagliflozin", "m_metformin", "m_losartan", "m_chlorthalidone", "m_sertraline", "m_atorvastatin", "c_mdd"],
        keys: { v_rrh_hp: "vs_1" },
        plan: [
          { kind: "vitals", vitalId: "v_rrh_hp" },
          { kind: "dx", conditionId: "c_dka", rank: "principal" }, { kind: "adverse-dx", allergyId: "a_empagliflozin", rank: "secondary" },
          { kind: "dx", conditionId: "c_panc", rank: "secondary" }, { kind: "dx", conditionId: "c_na", rank: "secondary" },
          { kind: "history", conditionId: "c_htn", label: "Hypertension", onsetText: "about 2014", source: "patient", coded: true },
          { kind: "history", conditionId: "c_t2dm", label: "Type 2 diabetes", onsetText: "2016", source: "patient", coded: true },
          { kind: "history", conditionId: "c_ckd", label: "CKD stage 3a", source: "outside_records", coded: true },
          { kind: "history", conditionId: "c_hld", label: "Hyperlipidemia", source: "outside_records", coded: false },
          { kind: "history", conditionId: "c_mdd", label: "Major depressive disorder, recurrent, mild", onsetText: "2019", source: "outside_records", coded: true },
          { kind: "allergies" },
          { kind: "lab", panel: "BMP", key: "bmp", labIds: ["l_rrh_ed_na", "l_rrh_ed_k", "l_rrh_ed_cl", "l_rrh_ed_co2", "l_rrh_ed_ag", "l_rrh_ed_bun", "l_rrh_ed_cr", "l_rrh_ed_cr_egfr", "l_rrh_ed_glu"] },
          { kind: "lab", key: "lipase", labIds: ["l_rrh_ed_lipase"] },
          { kind: "inpatient-med", medId: "i_insulin" }, { kind: "inpatient-med", medId: "i_d5lr" },
          { kind: "home-meds" },
        ],
      },
      {
        key: "pn1", kind: "progress", at: U("2024-11-03T13:40Z"), signedAt: U("2024-11-03T14:25:30Z"), author: "rrh:raman",
        factIds: ["c_dka", "l_rrh_d2_co2", "l_rrh_d2_ag", "l_rrh_pm_bhb", "i_glargine", "i_insulin", "m_empagliflozin", "m_metformin"],
        plan: [
          { kind: "vitals", vitalId: "v_rrh_d2" },
          { kind: "dx", conditionId: "c_dka", rank: "principal" }, { kind: "dx", conditionId: "c_na", rank: "secondary" },
          { kind: "lab", key: "bhb_pm", labIds: ["l_rrh_pm_bhb"] },
          { kind: "lab", panel: "BMP", key: "bmp_am", labIds: ["l_rrh_d2_na", "l_rrh_d2_k", "l_rrh_d2_cl", "l_rrh_d2_co2", "l_rrh_d2_ag", "l_rrh_d2_bun", "l_rrh_d2_cr", "l_rrh_d2_cr_egfr", "l_rrh_d2_glu"] },
          { kind: "inpatient-med", medId: "i_insulin" }, { kind: "inpatient-med", medId: "i_d5lr" }, { kind: "inpatient-med", medId: "i_glargine" },
        ],
      },
      {
        key: "consult", kind: "consult", at: U("2024-11-03T16:20Z"), signedAt: U("2024-11-03T17:45:30Z"), author: "rrh:vasquez",
        factIds: ["c_dka", "nf_endo_advice", "m_empagliflozin", "m_metformin", "i_glargine"],
        keys: { c_dka: "dx_edka" },
        plan: [
          { kind: "dx", conditionId: "c_dka" },
          { kind: "lab", key: "bhb_1", labIds: ["l_rrh_ed_bhb"] }, { kind: "lab", key: "bhb_2", labIds: ["l_rrh_pm_bhb"] },
          { kind: "lab", key: "bhb_3", labIds: ["l_rrh_d2_bhb"] },
          { kind: "lab", panel: "BMP", key: "bmp_am", labIds: ["l_rrh_d2_na", "l_rrh_d2_k", "l_rrh_d2_cl", "l_rrh_d2_co2", "l_rrh_d2_ag", "l_rrh_d2_bun", "l_rrh_d2_cr", "l_rrh_d2_cr_egfr", "l_rrh_d2_glu"] },
          { kind: "inpatient-med", medId: "i_insulin" }, { kind: "inpatient-med", medId: "i_glargine" }, { kind: "inpatient-med", medId: "i_lispro" },
          { kind: "allergies" }, { kind: "home-meds" },
        ],
      },
      {
        key: "pn2", kind: "progress", at: U("2024-11-04T14:00Z"), signedAt: U("2024-11-04T15:10:05Z"), author: "rrh:raman",
        factIds: ["c_dka", "c_na", "l_rrh_d3_na", "l_rrh_d3_cr", "i_glargine", "i_lispro", "m_losartan", "m_chlorthalidone"],
        plan: [
          { kind: "vitals", vitalId: "v_rrh_d3" },
          { kind: "dx", conditionId: "c_dka", rank: "principal" }, { kind: "dx", conditionId: "c_na", rank: "secondary" },
          { kind: "lab", panel: "BMP", key: "bmp", labIds: ["l_rrh_d3_na", "l_rrh_d3_k", "l_rrh_d3_cl", "l_rrh_d3_co2", "l_rrh_d3_ag", "l_rrh_d3_bun", "l_rrh_d3_cr", "l_rrh_d3_cr_egfr", "l_rrh_d3_glu"] },
          { kind: "inpatient-med", medId: "i_glargine" }, { kind: "inpatient-med", medId: "i_lispro" },
        ],
      },
      {
        key: "pn3", kind: "progress", at: U("2024-11-05T13:30Z"), signedAt: U("2024-11-05T14:05:40Z"), author: "rrh:raman",
        factIds: ["c_dka", "l_rrh_dc_na", "l_rrh_dc_cr", "m_metformin", "m_empagliflozin"],
        plan: [
          { kind: "dx", conditionId: "c_dka", rank: "principal" }, { kind: "dx", conditionId: "c_na", rank: "secondary" },
          { kind: "lab", panel: "BMP", key: "bmp", labIds: ["l_rrh_dc_na", "l_rrh_dc_k", "l_rrh_dc_cl", "l_rrh_dc_co2", "l_rrh_dc_ag", "l_rrh_dc_bun", "l_rrh_dc_cr", "l_rrh_dc_cr_egfr", "l_rrh_dc_glu"] },
          { kind: "inpatient-med", medId: "i_glargine" }, { kind: "inpatient-med", medId: "i_lispro" },
        ],
      },
      {
        key: "dc", kind: "discharge", at: U("2024-11-02T06:30Z"), signedAt: U("2024-11-05T21:14:09Z"), author: "rrh:raman",
        factIds: ["nf_precipitant", "c_dka", "c_panc", "c_na", "m_empagliflozin", "m_metformin", "m_chlorthalidone", "m_losartan"],
        keys: { v_rrh_dc: "vs_dc", d_rrh_dc: "bmp_dc" },
        plan: [
          { kind: "dx", conditionId: "c_dka", rank: "principal" }, { kind: "adverse-dx", allergyId: "a_empagliflozin", rank: "secondary" },
          { kind: "dx", conditionId: "c_na", rank: "secondary" }, { kind: "dx", conditionId: "c_panc", rank: "secondary" },
          { kind: "vitals", vitalId: "v_rrh_dc" },
          { kind: "lab", key: "bhb_3", labIds: ["l_rrh_d2_bhb"] },
          { kind: "lab", panel: "BMP", key: "bmp_dc", labIds: ["l_rrh_dc_na", "l_rrh_dc_k", "l_rrh_dc_cl", "l_rrh_dc_co2", "l_rrh_dc_ag", "l_rrh_dc_bun", "l_rrh_dc_cr", "l_rrh_dc_cr_egfr", "l_rrh_dc_glu"] },
          { kind: "allergies" }, { kind: "home-meds" },
          { kind: "follow-up", key: "fu_pcp", with: "Primary care (Northgate Family Medicine)", when: "within 1 week", purpose: "Decide whether to restart empagliflozin; recheck basic metabolic panel" },
        ],
      },
    ],
  },
  {
    id: "e_lv_2026_07_13", source: "C", kind: "office", start: T("2026-07-13T10:30"), reason: "New patient: CKD", clinician: "lv:marsh",
    referredBy: "Northgate Family Medicine - Dr Reyes", ckdCategory: { g: "G3b", a: "A3" },
    addressed: [
      { conditionId: "c_ckd", status: "active", icd10: "N18.32", label: "Chronic kidney disease, stage 3b" },
      { conditionId: "c_t2dm", status: "active", icd10: "E11.22", label: "Type 2 diabetes mellitus with diabetic chronic kidney disease" },
      { conditionId: "c_htn", status: "active", icd10: "I12.9", label: "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease" },
      { conditionId: "c_na", status: "active", icd10: "E87.1", label: "Hypo-osmolality and hyponatremia" },
      { conditionId: "c_dka", status: "history", icd10: "Z86.39", label: "Personal history of other endocrine, nutritional and metabolic disease" },
    ],
    documents: [{
      key: "note", kind: "office-note", at: T("2026-07-13T10:30"), signedAt: T("2026-07-13T16:55:02"), author: "lv:marsh",
      factIds: ["c_ckd", "c_na", "nf_na_sertraline", "nf_sglt2_decision", "m_finerenone", "m_losartan", "m_chlorthalidone", "m_metformin", "m_glargine"],
    }],
  },
  {
    id: "e_lv_2026_08_10", source: "C", kind: "phone", start: T("2026-08-10T15:40"), reason: "Lab review", clinician: "lv:marsh",
    documents: [{ key: "note", kind: "phone-note", at: T("2026-08-10T15:40"), signedAt: T("2026-08-10T15:52:18"), author: "lv:marsh", factIds: ["l_2026_08_10_k", "l_2026_08_10_cr", "m_finerenone"] }],
  },
  {
    id: "e_lv_2026_09_14", source: "C", kind: "phone", start: T("2026-09-14T16:20"), reason: "Hyperkalemia", clinician: "lv:marsh",
    documents: [{ key: "note", kind: "phone-note", at: T("2026-09-14T16:20"), signedAt: T("2026-09-14T16:41:33"), author: "lv:marsh", factIds: ["l_2026_09_14_k1", "l_2026_09_14_k2", "m_finerenone"] }],
  },
];

// Northgate events outside visits and the referral.
const referrals: Patient["referrals"] = [{
  id: "hero", by: "B", author: "ngf:treyes", encounter: "e_ng_2026_05_04", created: T("2026-05-04T10:52"),
  to: { org: "Lakeview Kidney Care", specialty: "Nephrology" },
  question: "eGFR decline, albuminuria, prior SGLT2i euDKA - re-challenge?", urgency: "routine",
  scheduled: T("2026-06-02T14:05"), appointmentOn: "2026-07-13", closed: T("2026-07-20T11:05"),
  dx: ["c_ckd", "c_t2dm", "c_htn"],
  factIds: ["l_2026_02_09_cr_egfr", "l_2026_02_09_uacr", "l_2022_02_07_cr_egfr", "c_dka", "m_empagliflozin", "a_empagliflozin", "m_losartan"],
}];

// ─── HomeLog ────────────────────────────────────────────────────────────────────────────────────

function homeLog(): { plan: HomeLogPlan; vitals: Vital[] } {
  const rng = new Rng("hero-homelog");
  const v: Vital[] = [];
  const fixed = new Set(["2023-04-11", "2024-02-10", "2024-10-31", "2025-08-19"]);
  // Fixture days, exactly as in the examples.
  v.push(
    { id: "h_2023_04_11_bp1", kind: "bp", at: T("2023-04-11T07:02"), setting: "home", source: "P", bp: { systolic: 142, diastolic: 86 }, pulse: 74, entryMethod: "device", arm: "left" },
    { id: "h_2023_04_11_bp2", kind: "bp", at: T("2023-04-11T07:05"), setting: "home", source: "P", bp: { systolic: 138, diastolic: 84 }, pulse: 72, entryMethod: "device", arm: "left" },
    { id: "h_2023_04_11_glu", kind: "home-glucose", at: T("2023-04-11T06:48"), setting: "home", source: "P", glucose: 141, renderedUnit: "mmol/L", mealMarker: "fasting", entryMethod: "device" },
    { id: "h_2024_02_10_glu1", kind: "home-glucose", at: T("2024-02-10T07:51"), setting: "home", source: "P", glucose: 146, renderedUnit: "mmol/L", mealMarker: "fasting", entryMethod: "device" },
    { id: "h_2024_02_10_glu2", kind: "home-glucose", at: T("2024-02-10T19:42"), setting: "home", source: "P", glucose: 162, renderedUnit: "mg/dL", mealMarker: "after_meal", entryMethod: "device" },
    { id: "h_2024_02_10_bp", kind: "bp", at: T("2024-02-10T08:04"), setting: "home", source: "P", bp: { systolic: 136, diastolic: 82 }, pulse: 70, entryMethod: "device", arm: "left" },
    { id: "h_2024_10_31_glu", kind: "home-glucose", at: T("2024-10-31T08:22"), setting: "home", source: "P", glucose: 171, renderedUnit: "mg/dL", mealMarker: "fasting", entryMethod: "device" },
    { id: "h_2025_08_19_glu", kind: "home-glucose", at: T("2025-08-19T07:06"), setting: "home", source: "P", glucose: 212, renderedUnit: "mg/dL", mealMarker: "fasting", entryMethod: "device" },
    { id: "h_2025_08_19_bp", kind: "bp", at: T("2025-08-19T12:30"), setting: "home", source: "P", bp: { systolic: 148, diastolic: 88 }, entryMethod: "typed", typo: { systolic: 184, fixedAt: "2025-08-21T01:42:15Z" } },
  );
  const doses: HomeLogPlan["doses"] = [{ id: "dose_2025_08_19", at: T("2025-08-19T21:45"), medId: "m_glargine", amount: 10 }];
  // Twice-weekly readings from 2023-04-13 to 2026-10-10 (Tuesday/Saturday), not on fixture days.
  let day = "2023-04-13";
  let n = 0;
  while (day <= "2026-10-10") {
    const dow = new Date(day + "T12:00:00Z").getUTCDay();
    if ((dow === 2 || dow === 6) && !fixed.has(day) && !(day >= "2024-11-01" && day <= "2024-11-06")) {
      const sick = day >= "2024-10-29" && day <= "2024-10-31";
      const trend = day < "2025-08-18" ? 0 : -2;
      const sys = Math.round(rng.normal(137 + trend, 6));
      const dia = Math.round(rng.normal(83, 4));
      const hh = 6 + rng.int(0, 2);
      const mm = rng.int(0, 59);
      const tt = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
      v.push({ id: `h_${day.replaceAll("-", "_")}_bp`, kind: "bp", at: T(`${day}T${tt}`), setting: "home", source: "P", bp: { systolic: sys, diastolic: dia }, pulse: rng.int(66, 82), entryMethod: "device", arm: "left" });
      const baseGlu = day < "2025-08-18" ? (day < "2024-11-01" ? 150 : 160) : day < "2025-10-01" ? 185 : 165;
      const glu = Math.round(rng.normal(sick ? 170 : baseGlu, 22));
      const gtime = `${String(hh).padStart(2, "0")}:${String(Math.max(0, mm - rng.int(5, 20))).padStart(2, "0")}`;
      v.push({ id: `h_${day.replaceAll("-", "_")}_glu`, kind: "home-glucose", at: T(`${day}T${gtime}`), setting: "home", source: "P", glucose: glu, renderedUnit: day < "2024-02-10" ? "mmol/L" : "mg/dL", mealMarker: "fasting", entryMethod: "device" });
      if (day >= "2025-08-18") {
        const amount = day >= "2025-10-01" && glu > 200 ? 12 : 10;
        doses.push({ id: `dose_${day.replaceAll("-", "_")}`, at: T(`${day}T21:${String(30 + rng.int(0, 25)).padStart(2, "0")}`), medId: "m_glargine", amount });
      }
      n++;
    }
    day = addDays(day, 1);
  }
  void n;
  const notes: HomeLogPlan["notes"] = [
    { id: "n_2023_04_11", at: T("2023-04-11T07:15"), tags: [], factIds: [], gist: "First day using the new cuff and the meter app together. Dr said check BP twice a week and sugar in the mornings." },
    { id: "n_2024_02_10", at: T("2024-02-10T15:30"), tags: [], factIds: [], gist: "Marcus changed the meter so it shows the numbers the same way the clinic does. Morning one was still the old way." },
    { id: "n_2024_10_29", at: T("2024-10-29T20:10"), tags: ["nausea", "vomiting", "diarrhea"], severity: 3, factIds: ["nf_precipitant"], gist: "Stomach bug started today; threw up after lunch, loose stools; a coworker had the same thing." },
    { id: "n_2024_10_30", at: T("2024-10-30T19:05"), tags: ["nausea", "poor_appetite"], severity: 4, factIds: ["nf_precipitant", "nf_kept_taking"], gist: "Still can't eat much, only sips of water and broth; took her morning pills anyway." },
    { id: "n_2024_10_31a", at: T("2024-10-31T08:40"), tags: ["nausea", "vomiting", "poor_appetite"], severity: 4, factIds: ["nf_precipitant", "nf_kept_taking"], gist: "Day 3 of this stomach bug. Threw up twice in the night. Can't keep food down, still taking my pills. Sugar only 171 so I don't think it's my diabetes." },
    { id: "n_2024_10_31b", at: T("2024-10-31T18:15"), tags: ["poor_appetite", "tired", "short_of_breath"], severity: 4, factIds: [], gist: "Had a few crackers and some ginger ale, that's all today. So tired. Breathing feels heavy when I lay down." },
    { id: "n_2024_11_07", at: T("2024-11-07T10:30"), tags: [], factIds: ["m_empagliflozin"], gist: "Home from Riverside since Tuesday. They said the Jardiance caused the acid problem; not to take it until Dr Reyes sees me." },
    { id: "n_2025_08_19", at: T("2025-08-19T21:50"), tags: [], factIds: [], gist: "Second night of the Lantus. The pen is easier than I thought." },
    { id: "n_2025_10_14", at: T("2025-10-14T21:20"), tags: [], factIds: ["nf_glargine_selfadjust"], gist: "Sugars running over 200 some days; she has started taking 12 units of Lantus on those nights instead of 10, her own rule." },
    { id: "n_2026_03_28", at: T("2026-03-28T16:45"), tags: ["pain"], severity: 2, factIds: ["nf_knee"], gist: "Knee acting up after gardening; took 2 Advil like she does maybe twice a week; updated her medicine list." },
    { id: "n_2026_09_15", at: T("2026-09-15T08:05"), tags: [], factIds: ["m_finerenone"], gist: "Dr Marsh called: potassium high, stop the new kidney pill (Kerendia) for now, eat fewer bananas, lab in 2 weeks." },
  ];
  // My Medicines saves. Each restates the list (P renders one item per save).
  const L = {
    metformin1000: { medId: "m_metformin", name: "Metformin", picked: { rxnorm: "861004", display: "metformin hydrochloride 1000 MG Oral Tablet" }, strengthText: "1000 mg", howITakeIt: "1 in the morning, 1 at supper", status: "taking" as const, started: "2016" },
    metformin500: { medId: "m_metformin", name: "Metformin", picked: { rxnorm: "861007", display: "metformin hydrochloride 500 MG Oral Tablet" }, strengthText: "500 mg", howITakeIt: "1 in the morning, 1 at supper", status: "taking" as const, started: "2016" },
    losartan50: { medId: "m_losartan", name: "Losartan", picked: { rxnorm: "52175", display: "losartan" }, strengthText: "50 mg", howITakeIt: "1 in the morning", status: "taking" as const, started: "2021-06", note: "Replaced the lisinopril" },
    losartan100: { medId: "m_losartan", name: "Losartan", picked: { rxnorm: "52175", display: "losartan" }, strengthText: "100 mg", howITakeIt: "1 in the morning", status: "taking" as const, started: "2021-06", note: "Replaced the lisinopril. Went up to 100 last August" },
    water: { medId: "m_chlorthalidone", name: "water pill", strengthText: "12.5", howITakeIt: "morning", status: "taking" as const, started: "2022", note: "chlorthalidone I think" },
    atorva: { medId: "m_atorvastatin", name: "Atorvastatin", picked: { rxnorm: "83367", display: "atorvastatin" }, strengthText: "40 mg", howITakeIt: "bedtime", status: "taking" as const },
    sertraline: { medId: "m_sertraline", name: "Sertraline", picked: { rxnorm: "312938", display: "sertraline 100 MG Oral Tablet" }, strengthText: "100 mg", howITakeIt: "1 in the morning", status: "taking" as const, started: "2019" },
    lantus: { medId: "m_glargine", name: "Lantus", picked: { rxnorm: "847230", display: "3 ML insulin glargine 100 UNT/ML Pen Injector" }, strengthText: "100 units/mL pen", howITakeIt: "10 units at bedtime, 12 if my sugar was over 200 that day", status: "taking" as const, started: "2025-08-18" },
    lantus10: { medId: "m_glargine", name: "Lantus", picked: { rxnorm: "847230", display: "3 ML insulin glargine 100 UNT/ML Pen Injector" }, strengthText: "100 units/mL pen", howITakeIt: "10 units at bedtime", status: "taking" as const, started: "2025-08-18" },
    advil: { medId: "m_ibuprofen", name: "Advil", strengthText: "200 mg", howITakeIt: "2 when my knee acts up, maybe twice a week", status: "taking" as const, started: "2025" },
    jardianceStopped: { medId: "m_empagliflozin", name: "Jardiance", picked: { rxnorm: "1545658", display: "empagliflozin 10 MG Oral Tablet" }, strengthText: "10 mg", status: "stopped" as const, started: "2023-03", stopped: "2024-11", note: "Hospital stopped it, I got very sick (DKA). My doctor said never take it again." },
    lisinopril: { medId: "m_lisinopril", name: "Lisinopril", status: "stopped" as const, stopped: "2021", note: "made me cough" },
  };
  // homelog_med_id follows the order she first added each medicine: Jardiance and lisinopril were
  // added as history only in 2026-03, which is why they are med_8 and med_9 in the 2026-05-02 example.
  const listSaves: HomeLogPlan["listSaves"] = [
    { at: "2023-04-11", recordedAt: "2023-04-12T06:04:10Z", entries: [L.metformin1000, L.losartan50, L.water, L.atorva, L.sertraline] },
    { at: "2025-08-18", entries: [L.metformin1000, L.losartan100, L.water, L.atorva, L.sertraline, L.lantus10] },
    { at: "2026-03-28", entries: [{ ...L.metformin500 }, L.losartan100, L.water, L.atorva, L.sertraline, L.lantus, L.advil, L.jardianceStopped, L.lisinopril] },
    { at: "2026-05-02", recordedAt: "2026-05-02T19:26:04Z", entries: [{ ...L.metformin500, note: "Dr Reyes cut it in half in February because of my kidneys" }, L.losartan100, L.water, L.atorva, L.sertraline, L.lantus, L.advil, L.jardianceStopped, L.lisinopril] },
  ];
  return { plan: { notes, doses, listSaves, edits: [{ date: "2025-08-19", recordedAt: "2025-08-21T01:42:15Z" }] }, vitals: v };
}

export function hero(): Patient {
  const hl = homeLog();
  const p: PatientIn = {
    id: "hero", role: "hero",
    demographics: { given: "Linda", family: "Okafor", birthDate: "1965-08-22", sex: "F", race: "Black or African American", tz: "America/Chicago", occupation: "School administrator" },
    sources: { A: { localId: "RRH-00731846" }, B: { localId: "NFM-00731552" }, C: { localId: "LV-0072914" }, P: { localId: "HL-U-58213" } },
    sensitivity: [{ category: "behavioral-health", factIds: ["c_mdd", "m_sertraline", "nf_na_sertraline"] }],
    encounters, conditions, meds, draws, labs, vitals: [...vitals, ...hl.vitals], allergies, narrativeFacts: facts,
    home: hl.plan, referrals,
    traps: [],
  };
  const out = finalize(p);
  out.traps = deriveTraps(out);
  return out;
}

/** Trap assignment from fact tags (the hero's traps are planted by hand in the facts above). */
export function deriveTraps(p: Patient): Patient["traps"] {
  const by = new Map<string, string[]>();
  const add = (t: string, id: string) => by.set(t, [...(by.get(t) ?? []), id]);
  for (const f of [...p.conditions, ...p.meds, ...p.labs, ...p.allergies, ...p.narrativeFacts]) for (const t of f.traps ?? []) add(t, f.id);
  // Traps that are properties of rendering rather than of one fact.
  if (p.vitals.some((v) => v.renderedUnit === "mmol/L")) add("T6", p.vitals.filter((v) => v.renderedUnit === "mmol/L").map((v) => v.id)[0]);
  if (p.vitals.some((v) => v.source === "P")) add("T10", "homelog-wall-clock");
  if (p.vitals.some((v) => v.typo || v.duplicateOf)) add("T14", p.vitals.find((v) => v.typo || v.duplicateOf)!.id);
  for (const e of p.encounters.filter((x) => x.source === "A" && x.documents.length > 1)) for (const d of e.documents) add("T15", `${e.id}/${d.key}`);
  if (p.encounters.some((e) => e.source === "A" && localDateDiffers(e.start))) add("T10", p.encounters.find((e) => e.source === "A")!.id);
  return [...by.entries()].sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1)))
    .map(([trap, factIds]) => ({ trap: trap as `T${number}`, factIds: [...new Set(factIds)], note: TRAP_NOTES[trap] ?? "" }));
}

function localDateDiffers(instant: string): boolean {
  return new Date(instant).toISOString().slice(0, 10) !== instant.slice(0, 10);
}

export const TRAP_NOTES: Record<string, string> = {
  T1: "held vs discontinued", T2: "status on two axes", T3: "superseded/corrected vs confirmed result", T4: "entered in error",
  T5: "stale problem list", T6: "glucose unit shift", T7: "platelets x10^3", T9: "numbers as text / sentinel",
  T10: "date-only and time-zone shifts", T11: "eGFR equation change", T12: "negation and rule-outs", T13: "prose-only facts",
  T14: "duplicates across sources", T15: "per-document med re-snapshot", T16: "local codes without standard codes",
  T17: "fuzzy onset", T18: "same reaction, two shapes", T19: "redaction hides a relevant med",
};
