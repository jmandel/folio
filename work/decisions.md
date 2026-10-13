# Decisions log (orchestrator)

Resolved at Stage 0a → 0b handoff (2026-10-13):

- **Partial dates**: allowed in `effective` and in payload date fields when the source only knows that much (`2019`, `2019-06`, `2019-06-14`); the precision is the string's precision. Spec to state it.
- **Section-level withholding**: no. The withholdable unit is a ref span (and its payload entry). Prose outside spans is disclosed whenever the item is.
- **Encounter grouping hint in envelope**: not now. Sources group in their payloads; revisit if the workbench timeline needs it.
- **T8 creatinine in µmol/L**: dropped — not credible at a US lab. Unit traps are T6 (glucose mg/dL vs mmol/L from the home meter) and T7 (platelets).
- **Problem-list stage in answer keys**: the key records the most recent clinician-asserted stage; a separately derived stage (from eGFR) is its own check, not the answer.
- **Patient-app records**: signed by the app's issuer (`did:web` of the app service), author = the patient.
- **Imported results**: B (primary care) issues its own copies of results interfaced from C, with a source note in the payload — this is how real EHRs behave and it is the T14 duplicate trap. B does not re-sign C's items.
- **Population size**: ~300 patients (Stage 1).
