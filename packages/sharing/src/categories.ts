// Sensitive-data categories a patient can keep private, and the presets built from them.
//
// The five categories follow the sensitivity codes HL7 defines for security labels (v3 ActCode,
// used by the HL7 Data Segmentation for Privacy guides) and the US rules that single these topics
// out. See work/sharing-notes.md for sources. Descriptions are written for the patient.

export type CategoryId = "mental_health" | "substance_use" | "sexual_reproductive" | "hiv_sti" | "genetic";

export interface Category {
  id: CategoryId;
  /** Short name shown on the toggle. */
  label: string;
  /** What the category covers, in plain words (for the agent and the notes). */
  covers: string;
  /** The topic as it reads after "nothing about": "alcohol or drug use". */
  about: string;
  /** HL7 v3 ActCode sensitivity codes this category corresponds to. */
  hl7: string[];
  /** Laws or rules that treat this topic specially (for the notes and the agent, not the patient). */
  basis: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "mental_health",
    about: "mental health",
    label: "Mental health",
    covers: "Depression, anxiety and other mental health conditions, and medicines mainly used for them, such as sertraline.",
    hl7: ["MH", "BH", "PSY"],
    basis: "HL7 MH/BH/PSY sensitivity codes; HIPAA psychotherapy-note rule; many state mental health confidentiality laws.",
  },
  {
    id: "substance_use",
    about: "alcohol or drug use",
    label: "Alcohol and drug use",
    covers: "Alcohol or drug use problems and their treatment, such as methadone or buprenorphine. Tobacco is not included.",
    hl7: ["SUD", "ETH", "ETHUD", "OPIOIDUD"],
    basis: "42 CFR Part 2 (federal rule for substance use disorder treatment records; excludes tobacco and caffeine); HL7 SUD/ETH codes.",
  },
  {
    id: "sexual_reproductive",
    about: "sexual or reproductive health",
    label: "Sexual and reproductive health",
    covers: "Pregnancy, birth control, fertility treatment, abortion and other sexual health care.",
    hl7: ["SEX", "PREGNANT"],
    basis: "HL7 SEX/PREGNANT codes; state reproductive health privacy laws (the 2024 HIPAA reproductive health rule was vacated in 2025).",
  },
  {
    id: "hiv_sti",
    about: "HIV or other sexually transmitted infections",
    label: "HIV and sexually transmitted infections",
    covers: "HIV status, HIV and STI tests and results, and the medicines that treat them.",
    hl7: ["HIV", "STD"],
    basis: "HL7 HIV/STD codes; state HIV confidentiality laws (most states require specific consent to disclose HIV test results).",
  },
  {
    id: "genetic",
    about: "genetic tests",
    label: "Genetic test results",
    covers: "Genetic tests and inherited conditions found by them, such as a BRCA result.",
    hl7: ["GDIS"],
    basis: "HL7 GDIS code; GINA and state genetic privacy laws.",
  },
];

export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;

/**
 * A sharing policy: which categories stay private, whether medicines are shared even when they fall
 * in a private category, and per-part overrides (key `<item>#<unit id>`) that win over both.
 */
export interface Policy {
  private: CategoryId[];
  shareMedicines: boolean;
  overrides: Record<string, "share" | "withhold">;
}

export type PresetId = "everything" | "private" | "private_meds";

export interface Preset {
  id: PresetId;
  label: string;
  policy: Policy;
}

const ALL: CategoryId[] = CATEGORIES.map((c) => c.id);

// What each choice shows and hides is not written here: it depends on the records being sent, so
// the site describes it from the decisions (see describe.ts).
export const PRESETS: Preset[] = [
  { id: "everything", label: "Share everything", policy: { private: [], shareMedicines: false, overrides: {} } },
  { id: "private", label: "Keep sensitive topics private", policy: { private: ALL, shareMedicines: false, overrides: {} } },
  { id: "private_meds", label: "Keep sensitive topics private, but list all my medicines", policy: { private: ALL, shareMedicines: true, overrides: {} } },
];

export const DEFAULT_PRESET: PresetId = "private";

export const presetPolicy = (id: PresetId): Policy => structuredClone(PRESETS.find((p) => p.id === id)!.policy);

/** The preset a policy equals, or "custom". */
export function presetOf(p: Policy): PresetId | "custom" {
  if (Object.keys(p.overrides).length) return "custom";
  const same = (a: CategoryId[], b: CategoryId[]) => a.length === b.length && a.every((x) => b.includes(x));
  for (const pr of PRESETS) {
    if (!same(pr.policy.private, p.private)) continue;
    // With nothing private, the medicine switch has no effect.
    if (p.private.length === 0 || pr.policy.shareMedicines === p.shareMedicines) return pr.id;
  }
  return "custom";
}

/** The purpose of this share; shown to the patient and given to her agent. */
export const PURPOSE = {
  recipient: "Lakeview Labs & Kidney Care",
  short: "the kidney clinic",
  why: "Referral to a kidney specialist (nephrology) for falling kidney function and protein in the urine. The referral asks whether a diabetes medicine of the SGLT2 inhibitor type (such as empagliflozin) can be tried again after it caused diabetic ketoacidosis in 2024, and the clinic is also looking into her low sodium.",
};
