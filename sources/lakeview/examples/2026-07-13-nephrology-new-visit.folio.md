---
folio: "0.1"
id: "01KXEQKXQGGFWM3XCNV7YSNJGV"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0072914"
effective: "2026-07-13T10:30:00-05:00"
recorded: "2026-07-13T16:55:02-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "TODO"
---
New patient. Referred by Northgate FM (Dr. Reyes) for eGFR decline, albuminuria, prior SGLT2i euDKA.

<ref id="dx_ckd">CKD G3b A3</ref>, diabetic and hypertensive. eGFR 54 → 41 since 2022, UACR 85 → 320 mg/g.
BP 136/82 on losartan 50 and chlorthalidone 12.5.

<ref id="dx_na">Na 132</ref>, mild. Chlorthalidone likely; sertraline (disclosed at intake) may contribute.
No change today.

Euglycemic DKA 11/2024 on empagliflozin, details per Riverside records.
<ref id="sglt2_decision">Not re-trying an SGLT2i for now. Revisit after her sick-day plan is proven.</ref>

Plan: start <ref id="rx_finerenone">finerenone 10 mg daily</ref>. K and creatinine in 4 weeks. Continue
losartan. Return 3 months.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-104552",
    "VISIT_TYPE": "NP",
    "VISIT_AT": "2026-07-13T10:30:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A3",
    "REFERRED_BY_TEXT": "Northgate Family Medicine - Dr Reyes"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104552",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104552",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104552",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_na": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104552",
    "DX_RANK": 4,
    "ICD10CM": "E87.1",
    "DX_TEXT": "Hypo-osmolality and hyponatremia",
    "DX_STATUS": "A"
  },
  "dx_dka_hx": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104552",
    "DX_RANK": 5,
    "ICD10CM": "Z86.39",
    "DX_TEXT": "Personal history of other endocrine, nutritional and metabolic disease",
    "DX_STATUS": "H"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-104552",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 136,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-07-13T10:34:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-104552",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 82,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-07-13T10:34:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-104552",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 78,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-07-13T10:34:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-104552",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 86.2,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-07-13T10:32:00-05:00"
  },
  "rx_finerenone": {
    "type": "MED_ORDER",
    "RX_ID": "RX-30418",
    "VISIT_ID": "NV-104552",
    "LV_DRUG_ID": "LVD-04471",
    "DRUG_NAME": "finerenone 10 mg tablet",
    "DOSE_QTY": 10,
    "DOSE_UNIT": "mg",
    "ROUTE": "PO",
    "FREQ_CODE": "QD",
    "MED_STATUS": 1,
    "START_DATE": "2026-07-14",
    "PRESCRIBER_NPI": "1999000042"
  }
}
```
