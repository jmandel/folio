---
folio: "0.1"
id: "01HX7YS9B0ZTABR4NE9SPG6WPY"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0092558"
effective: "2024-05-06T13:20:00-05:00"
recorded: "2024-05-06T17:01:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 152/80, HR 83, weight 89.9 kg at 2024-05-06 13:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A1), onset 2023-12-29</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2015-09</ref>
- <ref id="dx_htn">Essential hypertension, onset 2013-10</ref>
- <ref id="dx_dka_hx">Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated, onset 2024-11-27</ref>
- eGFR 38 (today)
- K 4.3 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-104064",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-05-06T13:20:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3b",
    "CKD_A": "A1"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104064",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104064",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104064",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_dka_hx": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104064",
    "DX_RANK": 4,
    "ICD10CM": "Z86.39",
    "DX_TEXT": "Personal history of other endocrine, nutritional and metabolic disease",
    "DX_STATUS": "H"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-104064",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 152,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-06T13:24:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-104064",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-06T13:24:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-104064",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 83,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-06T13:24:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-104064",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 89.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-06T13:22:00-05:00"
  }
}
```
