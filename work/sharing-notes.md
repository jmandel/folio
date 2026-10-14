# Sharing policies: notes and sources

These notes cover how the Sharing view's choices were picked and where the categories come from.
The code is in `packages/sharing`.

## Categories

The five topics Linda can keep private follow the sensitivity codes HL7 defines for security labels,
and the US rules that single these topics out.

| Category | HL7 v3 ActCode sensitivity codes | Rules that single it out |
|---|---|---|
| Mental health | MH, BH, PSY (PSYTHPN for psychotherapy notes) | HIPAA's psychotherapy-note rule; state mental health confidentiality laws |
| Alcohol and drug use | SUD, ETH, ETHUD, OPIOIDUD | 42 CFR Part 2, which covers substance use disorder treatment records. The 2024 final rule aligned it with HIPAA, with compliance due by 2026-02-16. Tobacco and caffeine are excluded, so F17 is excluded here too. |
| Sexual and reproductive health | SEX, PREGNANT | State laws. The 2024 HIPAA reproductive health privacy rule was vacated nationwide in *Purl v. HHS* (N.D. Tex., 2025-06-18). |
| HIV and STIs | HIV, STD | State HIV confidentiality laws |
| Genetic test results | GDIS | GINA and state genetic privacy laws |

Two other HL7 codes were left out: SDV (sexual assault, abuse, domestic violence) and SCA (sickle
cell). Nothing in the reference corpus falls under them, and five toggles already make a long list
for a patient. Either can be added as a category with one rule block each.

Sources:

- HL7 Terminology, v3 ActCode code system, release 11.0.0 (fetched 2026-10-14):
  https://terminology.hl7.org/CodeSystem-v3-ActCode.html. The definitions of ETH, GDIS, HIV, MST,
  PREGNANT, SCA, SDV, SEX, STD, BH, MH, PSY, PSYTHPN, SUD, ETHUD and OPIOIDUD were checked there.
- HL7 FHIR Data Segmentation for Privacy IG (continuous build):
  https://build.fhir.org/ig/HL7/fhir-security-label-ds4p/
- SAMHSA C2S value sets in VSAC, e.g. "C2S Mental Health Disorders" (2.16.840.1.113762.1.4.1142.34).
  These are maintained code lists for this exact segmentation job. They are built from SNOMED CT and
  mapped to ICD-10.
- HHS fact sheet on the 42 CFR Part 2 final rule:
  https://www.hhs.gov/hipaa/for-professionals/regulatory-initiatives/fact-sheet-42-cfr-part-2-final-rule/index.html
- On *Purl v. HHS*: https://www.americanhealthlaw.org/content-library/publications/bulletins/922690a7-ccdf-4294-bb6f-488be49ba152/HIPAA-Reproductive-Health-Care-Privacy-Rule-Vacate
- SSRIs and hyponatremia: Spinler & Jacob, *Ann Pharmacother* 2006 (incidence 0.5–32%; risk
  factors include older age, female sex and diuretic use). Also Liu et al., *CMAJ* 1996, which
  reviewed 736 spontaneous reports, 86 of them for sertraline. These back the one context rule that
  fires for Linda.

## Choices

There are three presets:

- Share everything
- Keep sensitive topics private (the default)
- Keep sensitive topics private, but list all my medicines

Under the presets sit five topic toggles and one switch, "list all my medicines". Changing a
toggle, the switch or a single part gives "Your own choice".

The medicine switch is the purpose-driven part. A kidney clinic needs the full medicine list to dose
drugs and to find drugs that affect sodium, potassium or kidney function. The switch shares any part
that is about a medicine only: a medicine entry, or a note phrase that names a medicine and no
condition. Diagnoses, notes about the condition and tests stay private. The copy says plainly that a
medicine can give the topic away.

### No "kidney care only" preset

A "minimum necessary for this referral" preset would have to label every entry as relevant or not.
Linda's records show why that is risky. The fact the referral turns on is that gastroenteritis and
poor intake set off the DKA. That fact sits in a narrative-only span with no code, and so does the
SGLT2 re-challenge decision. A topic filter would hide both, or else need hand-written relevance
rules that a clinician should own. Purpose shows up instead as the medicine switch, in the purpose
line the patient sees, and in the agent's prompt.

### No time-window control

The referral items run from 2024-11 to 2026-07, and the oldest of them, the DKA admission, is the
reason for the referral. A "last two years" window would either change nothing or drop the most
important record. Leaving a whole record out is still possible with "Don't send" in the detailed
layer.

## How rules assign categories

`packages/sharing/src/rules.ts` holds the rules as data. Each rule names a category, a basis
(medicine, condition, test or source flag), what it matches and a one-sentence reason. A rule can
match:

- ICD-10-CM ranges or prefixes;
- RxNorm ingredient ids;
- LOINC codes;
- medicine names (whole words);
- condition words (word starts);
- a source-schema field value, such as Northgate's `restricted: "BH"`.

`FIELDS` lists where codes and names live in the four schemas. `MEDICINE_TYPES` lists which entry
types are medicines.

On Linda's whole record (1,238 units across 466 items), "Keep sensitive topics private" withholds 16
units. They are exactly the units the old text pattern (`sertralin|zoloft|depress|mdd|F32/F33|
behavioral health`) caught, and all are mental health. With medicines listed, 4 stay withheld.

Known limits:

- **Word rules.** "Depression" also matches "ST depression" in a cardiology note. Condition words
  apply only to name fields and span text, but a production list needs negative contexts or
  maintained value sets.
- **Dual-use medicines are left out on purpose.** Examples are duloxetine and amitriptyline (also
  for diabetic nerve pain), misoprostol (ulcers) and tenofovir (hepatitis B). Classing them as
  sensitive would hide non-sensitive care.
- **Always-shared parts are not classified.** These are the author's role and the prose outside
  spans. A record written by a psychiatrist reveals the topic whatever is withheld. The view says so
  for each record, and the spec's context-loss section covers it.

## Hook for compiled views

`CategorySource` is the interface: `classify(part) → Hit[]`. The rule source reads entries
directly. `viewRowSource(rows)` takes rows of the form `{item, unit, categories}` from a compiled
mapper's view (views v2's sensitivity column) and produces the same hits. `decide(parts, policy,
sources)` accepts any list of sources, so a view-backed source can replace the rules or run beside
them. No dependency on `packages/views`.

## Context rules and the suggested refinement

`CONTEXT_RULES` pairs medicines with findings they can explain:

- antidepressants with low sodium (E87.1, "hyponatremia", LOINC 2951-2 below 135);
- lithium with kidney disease.

A suggestion appears when all three of these hold:

- the policy withholds a medicine-only part naming one of those medicines;
- a shared part shows the finding;
- the medicine switch is off.

The suggestion is a patch (`shareMedicines: true`). For Linda it fires on the default preset, and
taking it re-shares 4 parts and leaves the depression diagnosis withheld. The receiver-side
context-loss quotes still come from the actual presentations.

## The agent

The live mode calls `https://openrouter.ai/api/v1/chat/completions` from the browser with a key the
user pastes in. The key is kept in localStorage only, with every access wrapped in try/catch. The
default model is `anthropic/claude-sonnet-5.5`. The model list also offers
`deepseek/deepseek-v4-pro`, `anthropic/claude-haiku-5.5` and `google/gemini-3.8-flash`, all taken
from `https://openrouter.ai/api/v1/models` on 2026-10-14. Any id can be typed.

The system prompt (`packages/sharing/src/agent.ts`) contains:

- the purpose;
- how withholding and markers work;
- the presets, categories and rules;
- one line per part, with its categories and current decision;
- the current policy and suggestions.

It does not contain the signed records. Replies may end with a fenced `policy` JSON block, which
`parseReply` checks against known categories and part keys. The UI shows what the block would
change and applies it only when the user presses Apply.

Without a key, the panel replays `RECORDED` (in `recorded.ts`). The tests check that its policies
parse and do what its text claims.
