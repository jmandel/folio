// Reference data shared by the truth generator and the renderers: drug products, conditions,
// analytes. RxNorm/SNOMED/ICD-10/LOINC codes are best-effort and were not checked against the
// terminology files (see README). Hero codes follow the Stage 0 examples.

import type { Analyte, Coding, Freq } from "./model.ts";

export interface DrugProduct {
  key: string;
  ingredient: string;               // lower-case generic name
  ingredientRx: string;             // RxNorm ingredient CUI
  strength: number;
  unit: "mg" | "units/mL" | "mcg";
  form: "tablet" | "capsule" | "pen" | "injection";
  scd?: string;                     // RxNorm SCD CUI
  scdName: string;                  // RxNorm-style name, as Northgate's drug file prints it
  brand?: string;                   // what patients call it
  klass: DrugClass;
}

export type DrugClass =
  | "biguanide" | "sglt2i" | "basal-insulin" | "rapid-insulin" | "regular-insulin" | "sulfonylurea" | "glp1ra" | "dpp4i"
  | "acei" | "arb" | "thiazide" | "ccb" | "beta-blocker" | "mra" | "ns-mra" | "loop" | "statin" | "ssri" | "nsaid"
  | "antiplatelet" | "thyroid" | "fluid" | "other";

const p = (
  key: string, ingredient: string, ingredientRx: string, strength: number, form: DrugProduct["form"],
  scd: string | undefined, klass: DrugClass, brand?: string, unit: DrugProduct["unit"] = "mg",
): DrugProduct => ({
  key, ingredient, ingredientRx, strength, unit, form, scd, klass, brand,
  scdName: form === "pen"
    ? `${ingredient} ${strength} UNT/ML Pen Injector`
    : `${ingredient.replace(/^metformin$/, "metformin hydrochloride").replace(/^losartan$/, "losartan potassium")} ${strength} MG Oral ${form === "capsule" ? "Capsule" : "Tablet"}`,
});

export const DRUGS: Record<string, DrugProduct> = Object.fromEntries([
  p("metformin-500", "metformin", "6809", 500, "tablet", "861007", "biguanide", "Glucophage"),
  p("metformin-1000", "metformin", "6809", 1000, "tablet", "861004", "biguanide", "Glucophage"),
  p("empagliflozin-10", "empagliflozin", "1545653", 10, "tablet", "1545658", "sglt2i", "Jardiance"),
  p("empagliflozin-25", "empagliflozin", "1545653", 25, "tablet", "1545664", "sglt2i", "Jardiance"),
  p("dapagliflozin-10", "dapagliflozin", "1488564", 10, "tablet", "1488574", "sglt2i", "Farxiga"),
  p("canagliflozin-100", "canagliflozin", "1373458", 100, "tablet", "1373463", "sglt2i", "Invokana"),
  p("glipizide-5", "glipizide", "4821", 5, "tablet", "310490", "sulfonylurea", "Glucotrol"),
  p("sitagliptin-100", "sitagliptin", "593411", 100, "tablet", "665033", "dpp4i", "Januvia"),
  p("semaglutide-1", "semaglutide", "1991302", 1, "pen", undefined, "glp1ra", "Ozempic", "mg"),
  p("dulaglutide-1.5", "dulaglutide", "1551291", 1.5, "pen", undefined, "glp1ra", "Trulicity", "mg"),
  p("glargine-100", "insulin glargine", "274783", 100, "pen", "847230", "basal-insulin", "Lantus", "units/mL"),
  p("detemir-100", "insulin detemir", "139825", 100, "pen", "847241", "basal-insulin", "Levemir", "units/mL"),
  p("lispro-100", "insulin lispro", "86009", 100, "pen", "847211", "rapid-insulin", "Humalog", "units/mL"),
  p("regular-insulin", "insulin regular (human)", "253182", 100, "injection", undefined, "regular-insulin"),
  p("fluid-lr", "lactated Ringer's", "", 0, "injection", undefined, "fluid"),
  p("fluid-d5lr", "dextrose 5% in lactated Ringer's", "", 0, "injection", undefined, "fluid"),
  p("fluid-ns", "sodium chloride 0.9%", "", 0, "injection", undefined, "fluid"),
  p("lisinopril-10", "lisinopril", "29046", 10, "tablet", "314076", "acei", "Zestril"),
  p("lisinopril-20", "lisinopril", "29046", 20, "tablet", "314077", "acei", "Zestril"),
  p("lisinopril-40", "lisinopril", "29046", 40, "tablet", "197884", "acei", "Zestril"),
  p("enalapril-10", "enalapril", "3827", 10, "tablet", "858817", "acei", "Vasotec"),
  p("losartan-50", "losartan", "52175", 50, "tablet", "979485", "arb", "Cozaar"),
  p("losartan-100", "losartan", "52175", 100, "tablet", "979480", "arb", "Cozaar"),
  p("valsartan-160", "valsartan", "69749", 160, "tablet", "349200", "arb", "Diovan"),
  p("chlorthalidone-25", "chlorthalidone", "2409", 25, "tablet", "197499", "thiazide"),
  p("hctz-25", "hydrochlorothiazide", "5487", 25, "tablet", "310798", "thiazide"),
  p("amlodipine-5", "amlodipine", "17767", 5, "tablet", "197361", "ccb", "Norvasc"),
  p("amlodipine-10", "amlodipine", "17767", 10, "tablet", "308135", "ccb", "Norvasc"),
  p("metoprolol-50", "metoprolol succinate", "6918", 50, "tablet", "866436", "beta-blocker", "Toprol XL"),
  p("carvedilol-12.5", "carvedilol", "20352", 12.5, "tablet", "200032", "beta-blocker", "Coreg"),
  p("spironolactone-25", "spironolactone", "9997", 25, "tablet", "313096", "mra", "Aldactone"),
  p("finerenone-10", "finerenone", "2562811", 10, "tablet", "2562816", "ns-mra", "Kerendia"),
  p("furosemide-40", "furosemide", "4603", 40, "tablet", "313988", "loop", "Lasix"),
  p("atorvastatin-20", "atorvastatin", "83367", 20, "tablet", "617310", "statin", "Lipitor"),
  p("atorvastatin-40", "atorvastatin", "83367", 40, "tablet", "617311", "statin", "Lipitor"),
  p("atorvastatin-80", "atorvastatin", "83367", 80, "tablet", "617314", "statin", "Lipitor"),
  p("rosuvastatin-20", "rosuvastatin", "301542", 20, "tablet", "859751", "statin", "Crestor"),
  p("sertraline-50", "sertraline", "36437", 50, "tablet", "312941", "ssri", "Zoloft"),
  p("sertraline-100", "sertraline", "36437", 100, "tablet", "312938", "ssri", "Zoloft"),
  p("escitalopram-10", "escitalopram", "321988", 10, "tablet", "349332", "ssri", "Lexapro"),
  p("ibuprofen-200", "ibuprofen", "5640", 200, "tablet", "310965", "nsaid", "Advil"),
  p("naproxen-220", "naproxen", "7258", 220, "tablet", "849574", "nsaid", "Aleve"),
  p("aspirin-81", "aspirin", "1191", 81, "tablet", "243670", "antiplatelet"),
  p("levothyroxine-75", "levothyroxine", "10582", 75, "tablet", "966222", "thyroid", "Synthroid", "mcg"),
].map((d) => [d.key, d]));

// Fix display names that are not "<ingredient> N MG Oral Tablet".
DRUGS["metoprolol-50"].scdName = "24 HR metoprolol succinate 50 MG Extended Release Oral Tablet";
DRUGS["levothyroxine-75"].scdName = "levothyroxine sodium 0.075 MG Oral Tablet";
DRUGS["semaglutide-1"].scdName = "semaglutide 1 MG/0.75 ML Pen Injector";
DRUGS["dulaglutide-1.5"].scdName = "dulaglutide 1.5 MG/0.5 ML Pen Injector";
DRUGS["glargine-100"].scdName = "insulin glargine 100 UNT/ML Pen Injector";
DRUGS["detemir-100"].scdName = "insulin detemir 100 UNT/ML Pen Injector";
DRUGS["lispro-100"].scdName = "insulin lispro 100 UNT/ML Pen Injector";

export function drug(key: string): DrugProduct {
  const d = DRUGS[key];
  if (!d) throw new Error(`unknown drug ${key}`);
  return d;
}

export function ingredientCoding(key: string): Coding | undefined {
  const d = drug(key);
  if (!d.ingredientRx) return undefined;
  return { system: "rxnorm", code: d.ingredientRx, display: d.ingredient };
}

export const RAAS_CLASSES: DrugClass[] = ["acei", "arb", "mra", "ns-mra"];

export const FREQ_TEXT: Record<Freq, string> = {
  QD: "daily", BID: "twice daily", TID: "three times daily", QHS: "at bedtime", QW: "weekly", PRN: "as needed",
};

// ─── Conditions ─────────────────────────────────────────────────────────────────────────────────

export interface ConditionDef { key: string; name: string; snomed: string; icd10: string; short: string }

export const CONDITIONS: Record<string, ConditionDef> = Object.fromEntries(([
  ["htn", "Essential hypertension", "59621000", "I10", "HTN"],
  ["t2dm", "Type 2 diabetes mellitus", "44054006", "E11.9", "T2DM"],
  ["t2dm-ckd", "Type 2 diabetes mellitus with diabetic chronic kidney disease", "771000119108", "E11.22", "T2DM w CKD"],
  ["ckd3a", "Chronic kidney disease stage 3a", "700378005", "N18.31", "CKD 3a"],
  ["ckd3b", "Chronic kidney disease stage 3b", "700379002", "N18.32", "CKD 3b"],
  ["ckd4", "Chronic kidney disease stage 4", "431857002", "N18.4", "CKD 4"],
  ["ckd2", "Chronic kidney disease stage 2", "431856006", "N18.2", "CKD 2"],
  ["hld", "Hyperlipidemia", "55822004", "E78.5", "HLD"],
  ["mdd", "Major depressive disorder, recurrent, mild", "191611001", "F33.0", "MDD"],
  ["obesity", "Obesity", "414916001", "E66.9", "Obesity"],
  ["hf", "Heart failure with reduced ejection fraction", "703272007", "I50.22", "HFrEF"],
  ["gout", "Gout", "90560007", "M10.9", "Gout"],
  ["oa-knee", "Primary osteoarthritis of knee", "239873007", "M17.9", "Knee OA"],
  ["hypothyroid", "Hypothyroidism", "40930008", "E03.9", "Hypothyroid"],
  ["dka", "Diabetic ketoacidosis", "420422005", "E11.10", "DKA"],
  ["hyponatremia", "Hyponatremia", "89627008", "E87.1", "Hyponatremia"],
  ["hyperkalemia", "Hyperkalemia", "14140009", "E87.5", "Hyperkalemia"],
  ["aki", "Acute kidney injury", "14669001", "N17.9", "AKI"],
  ["pancreatitis", "Acute pancreatitis", "197456007", "K85.90", "Pancreatitis"],
  ["acs", "Acute coronary syndrome", "394659003", "I24.9", "ACS"],
  ["pneumonia", "Pneumonia", "233604007", "J18.9", "Pneumonia"],
  ["angioedema", "Angioedema", "41291007", "T78.3XXA", "Angioedema"],
  ["anxiety", "Generalized anxiety disorder", "21897009", "F41.1", "GAD"],
] as const).map(([key, name, snomed, icd10, short]) => [key, { key, name, snomed, icd10, short }]));

export function conditionCoding(key: string): Coding[] {
  const c = CONDITIONS[key];
  return [
    { system: "snomed", code: c.snomed, display: c.name },
    { system: "icd10", code: c.icd10, display: c.name },
  ];
}

// ─── Analytes (canonical units) ─────────────────────────────────────────────────────────────────

export const ANALYTES: Record<Analyte, { unit: string; loinc?: string; name: string }> = {
  creatinine: { unit: "mg/dL", loinc: "2160-0", name: "Creatinine" },
  egfr: { unit: "mL/min/1.73m2", loinc: "98979-8", name: "eGFR (CKD-EPI 2021)" },
  potassium: { unit: "mmol/L", loinc: "2823-3", name: "Potassium" },
  sodium: { unit: "mmol/L", loinc: "2951-2", name: "Sodium" },
  chloride: { unit: "mmol/L", loinc: "2075-0", name: "Chloride" },
  bicarbonate: { unit: "mmol/L", loinc: "2028-9", name: "Bicarbonate" },
  "anion-gap": { unit: "mmol/L", loinc: "33037-3", name: "Anion gap" },
  bun: { unit: "mg/dL", loinc: "3094-0", name: "Urea nitrogen" },
  glucose: { unit: "mg/dL", loinc: "2345-7", name: "Glucose" },
  a1c: { unit: "%", loinc: "4548-4", name: "Hemoglobin A1c" },
  uacr: { unit: "mg/g", loinc: "9318-7", name: "Albumin/creatinine ratio" },
  platelets: { unit: "10*3/uL", loinc: "777-3", name: "Platelets" },
  wbc: { unit: "10*3/uL", loinc: "6690-2", name: "White blood cells" },
  hemoglobin: { unit: "g/dL", loinc: "718-7", name: "Hemoglobin" },
  bhb: { unit: "mmol/L", name: "Beta-hydroxybutyrate" },
  ph: { unit: "[pH]", loinc: "2746-6", name: "pH, venous" },
  pco2: { unit: "mmHg", loinc: "2021-4", name: "pCO2, venous" },
  lipase: { unit: "U/L", loinc: "3040-3", name: "Lipase" },
  troponin: { unit: "ng/mL", loinc: "10839-9", name: "Troponin I" },
};

export const MGDL_PER_MMOL_GLUCOSE = 18.016;
