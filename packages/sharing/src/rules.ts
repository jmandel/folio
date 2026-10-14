// The rules that put a disclosure unit (one structured entry, or one narrative-only span) into a
// sensitive category. They are data so the site can show them and say which rule matched.
//
// Code lists are short and illustrative, chosen to cover the conditions and medicines in the
// reference stack plus their common neighbours. A production system would use maintained value
// sets (for example the SAMHSA C2S sets in VSAC); see work/sharing-notes.md.

import type { CategoryId } from "./categories.ts";

/** What a rule looks at. */
export type Match =
  /** ICD-10-CM codes: a 3-character range ("F20-F48") or a code prefix ("Z71.4"). */
  | { icd10: string[] }
  /** RxNorm concept ids (ingredient-level). */
  | { rxnorm: string[] }
  /** LOINC test codes. */
  | { loinc: string[] }
  /** Medicine names (generic or brand), as whole words in name fields and in note text. */
  | { medicines: string[] }
  /** Words for conditions, as word starts in name fields and in note text. */
  | { terms: string[] }
  /** A source-schema field with a given value, such as Northgate's `restricted: "BH"`. */
  | { field: string; equals: string };

export interface Rule {
  id: string;
  category: CategoryId;
  /** Whether a match means the part is about a medicine, a condition, a test or a source flag. */
  basis: "medicine" | "condition" | "test" | "flag";
  match: Match;
  /** One plain sentence: why a match puts the part in the category. */
  because: string;
}

export const RULES: Rule[] = [
  // ─── mental health ───────────────────────────────────────────────────────────────────────────
  {
    id: "mh-icd10",
    category: "mental_health",
    basis: "condition",
    match: { icd10: ["F20-F48", "F50-F69", "F90-F99", "R45.851", "Z91.5"] },
    because: "Diagnosis codes in this range are mental health conditions (ICD-10-CM chapter F, without alcohol/drug use and dementia).",
  },
  {
    id: "mh-rxnorm",
    category: "mental_health",
    basis: "medicine",
    // sertraline, fluoxetine, citalopram, escitalopram, paroxetine, venlafaxine, bupropion,
    // mirtazapine, quetiapine, aripiprazole, lithium, buspirone
    match: { rxnorm: ["36437", "4493", "2556", "321988", "32937", "39786", "42347", "15996", "51272", "89013", "6448", "1827"] },
    because: "This medicine is mainly used for depression, anxiety or another mental health condition.",
  },
  {
    id: "mh-medicines",
    category: "mental_health",
    basis: "medicine",
    match: {
      medicines: [
        "sertraline", "zoloft", "fluoxetine", "prozac", "citalopram", "celexa", "escitalopram", "lexapro", "paroxetine", "paxil",
        "venlafaxine", "effexor", "bupropion", "wellbutrin", "mirtazapine", "remeron", "quetiapine", "seroquel",
        "aripiprazole", "abilify", "lithium", "buspirone",
      ],
    },
    because: "This medicine is mainly used for depression, anxiety or another mental health condition.",
  },
  {
    id: "mh-terms",
    category: "mental_health",
    basis: "condition",
    match: { terms: ["depression", "depressive", "anxiety disorder", "bipolar", "schizophren", "psychiatr", "PTSD", "suicid", "behavioral health"] },
    because: "The text names a mental health condition or service.",
  },
  {
    id: "mh-northgate-flag",
    category: "mental_health",
    basis: "flag",
    match: { field: "restricted", equals: "BH" },
    because: "Northgate marked this entry restricted for behavioral health.",
  },

  // ─── alcohol and drug use ────────────────────────────────────────────────────────────────────
  {
    id: "sud-icd10",
    category: "substance_use",
    basis: "condition",
    // F17 (nicotine) is left out: 42 CFR Part 2 does not cover tobacco.
    match: { icd10: ["F10-F16", "F18-F19", "Z71.4", "Z71.5"] },
    because: "Diagnosis codes in this range are alcohol or drug use disorders, or counseling for them.",
  },
  {
    id: "sud-medicines",
    category: "substance_use",
    basis: "medicine",
    match: { medicines: ["buprenorphine", "suboxone", "methadone", "naltrexone", "vivitrol", "disulfiram", "antabuse", "acamprosate"] },
    because: "This medicine is used to treat alcohol or opioid use disorder.",
  },
  {
    id: "sud-terms",
    category: "substance_use",
    basis: "condition",
    match: { terms: ["alcohol use disorder", "opioid use disorder", "substance use", "alcohol abuse", "drug abuse", "detox"] },
    because: "The text names an alcohol or drug use problem or its treatment.",
  },

  // ─── sexual and reproductive health ──────────────────────────────────────────────────────────
  {
    id: "sex-icd10",
    category: "sexual_reproductive",
    basis: "condition",
    match: { icd10: ["O00-O9A", "Z30-Z39", "N96-N98"] },
    because: "Diagnosis codes in this range are about pregnancy, birth control or fertility.",
  },
  {
    id: "sex-medicines",
    category: "sexual_reproductive",
    basis: "medicine",
    match: { medicines: ["mifepristone", "levonorgestrel", "norethindrone", "etonogestrel", "drospirenone", "plan b", "nexplanon"] },
    because: "This medicine is used for birth control or to end a pregnancy.",
  },
  {
    id: "sex-terms",
    category: "sexual_reproductive",
    basis: "condition",
    match: { terms: ["pregnan", "contracept", "abortion", "miscarriage", "infertility", "IVF"] },
    because: "The text is about pregnancy, birth control or fertility.",
  },

  // ─── HIV and sexually transmitted infections ─────────────────────────────────────────────────
  {
    id: "hiv-icd10",
    category: "hiv_sti",
    basis: "condition",
    match: { icd10: ["B20", "Z21", "R75", "Z71.7", "A50-A64"] },
    because: "Diagnosis codes in this range are HIV or sexually transmitted infections.",
  },
  {
    id: "hiv-loinc",
    category: "hiv_sti",
    basis: "test",
    // HIV-1/2 antigen+antibody screen, HIV-1 RNA viral load, chlamydia and gonorrhea NAATs
    match: { loinc: ["56888-1", "75622-1", "20447-9", "43304-5", "43305-2"] },
    because: "This is an HIV or sexually transmitted infection test.",
  },
  {
    id: "hiv-medicines",
    category: "hiv_sti",
    basis: "medicine",
    match: { medicines: ["bictegravir", "biktarvy", "dolutegravir", "emtricitabine", "truvada", "descovy", "efavirenz", "cabotegravir"] },
    because: "This medicine treats or prevents HIV.",
  },
  {
    id: "hiv-terms",
    category: "hiv_sti",
    basis: "condition",
    match: { terms: ["HIV", "syphilis", "chlamydia", "gonorrhea", "herpes simplex", "sexually transmitted"] },
    because: "The text names HIV or a sexually transmitted infection.",
  },

  // ─── genetic ─────────────────────────────────────────────────────────────────────────────────
  {
    id: "gen-icd10",
    category: "genetic",
    basis: "condition",
    match: { icd10: ["Z15", "Z14", "Z13.7"] },
    because: "Diagnosis codes in this range record a genetic finding or genetic testing.",
  },
  {
    id: "gen-terms",
    category: "genetic",
    basis: "condition",
    match: { terms: ["genetic test", "BRCA", "genotype", "germline", "carrier status"] },
    because: "The text is about a genetic test or its result.",
  },
];

/**
 * Where each kind of code or name lives in the four source schemas. Keys are matched at any depth
 * of an entry (so `test.loinc` and `components[].test.loinc` are both found).
 */
export const FIELDS = {
  icd10: ["icd10cm", "ICD10CM"],
  rxnorm: ["rxnorm_ingredient", "rxnorm"],
  loinc: ["loinc", "LOINC"],
  names: [
    // riverside
    "drug_name", "label", "condition", "substance",
    // northgate
    "description", "display", "name", "reason_text",
    // lakeview
    "DRUG_NAME", "DX_TEXT", "COMMENT_TEXT",
    // homelog
    "med_name", "note",
  ],
} as const;

/** Entry `type` values that are medicines, per source. */
export const MEDICINE_TYPES: Record<string, string[]> = {
  riverside: ["home_med", "inpatient_med"],
  northgate: ["med_event"],
  lakeview: ["MED_ORDER", "MED_STATUS_HIST"],
  homelog: ["my_med", "dose_log"],
};

/**
 * Medicines whose being withheld can change what a shared result means. Each one names the
 * findings it can explain; if a withheld part names the medicine and a shared part shows the
 * finding, the site suggests sharing the medicine.
 */
export interface ContextRule {
  id: string;
  medicines: string[];
  /** The finding, in plain words ("low sodium"). */
  finding: string;
  shows: { icd10?: string[]; terms?: string[]; loincBelow?: { loinc: string; below: number }[]; loincAbove?: { loinc: string; above: number }[] };
  /** One plain sentence on how the medicine relates to the finding. */
  plain: string;
}

export const CONTEXT_RULES: ContextRule[] = [
  {
    id: "antidepressant-low-sodium",
    medicines: ["sertraline", "zoloft", "fluoxetine", "citalopram", "escitalopram", "paroxetine", "venlafaxine", "mirtazapine"],
    finding: "low sodium",
    shows: { icd10: ["E87.1"], terms: ["hyponatremia", "low sodium"], loincBelow: [{ loinc: "2951-2", below: 135 }] },
    plain: "Antidepressants such as sertraline can lower the sodium (salt) level in the blood, especially in older adults and people who take a water pill.",
  },
  {
    id: "lithium-kidney",
    medicines: ["lithium"],
    finding: "kidney disease",
    shows: { icd10: ["N18"], terms: ["chronic kidney disease"] },
    plain: "Lithium can harm the kidneys, and its dose depends on how well the kidneys work.",
  },
];

/**
 * Plain names for the conditions and tests a part can be about, so the site can say "your
 * depression diagnosis" instead of naming a category. Matched against the part's diagnosis codes
 * (ICD-10-CM prefixes), test codes, and condition words. A sensitive part that matches none is
 * described by its category ("notes about your mental health").
 */
export interface PlainName {
  category: CategoryId;
  label: string;
  icd10?: string[];
  loinc?: string[];
  terms?: string[];
}

export const PLAIN_NAMES: PlainName[] = [
  { category: "mental_health", label: "your depression diagnosis", icd10: ["F32", "F33", "F34.1"], terms: ["depression", "depressive"] },
  { category: "mental_health", label: "your anxiety diagnosis", icd10: ["F41"], terms: ["anxiety disorder"] },
  { category: "mental_health", label: "your bipolar disorder diagnosis", icd10: ["F31"], terms: ["bipolar"] },
  { category: "mental_health", label: "your schizophrenia diagnosis", icd10: ["F20", "F25"], terms: ["schizophren"] },
  { category: "mental_health", label: "your PTSD diagnosis", icd10: ["F43.1"], terms: ["PTSD"] },
  { category: "substance_use", label: "your alcohol use diagnosis", icd10: ["F10"], terms: ["alcohol use disorder", "alcohol abuse"] },
  { category: "substance_use", label: "your opioid use diagnosis", icd10: ["F11"], terms: ["opioid use disorder"] },
  { category: "sexual_reproductive", label: "your pregnancy", icd10: ["O", "Z33", "Z34"], terms: ["pregnan"] },
  { category: "sexual_reproductive", label: "your birth control", icd10: ["Z30"], terms: ["contracept"] },
  { category: "hiv_sti", label: "your HIV diagnosis", icd10: ["B20", "Z21"], terms: ["HIV"] },
  { category: "hiv_sti", label: "your HIV and STI tests", loinc: ["56888-1", "75622-1", "20447-9", "43304-5", "43305-2"] },
  { category: "genetic", label: "your genetic test results", icd10: ["Z15", "Z14"], terms: ["genetic test", "BRCA", "germline"] },
];
