---
folio: "0.1"
id: "01JC4F4270EP302GHFJBNA9RMK"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0082384"
effective: "2024-11-07T12:00:00-06:00"
recorded: "2024-11-07T17:25:00-06:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 144/80, HR 79, weight 83.4 kg at 2024-11-07 12:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A2), onset 2025-03-06</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2018</ref>
- <ref id="dx_htn">Essential hypertension, onset 2018</ref>
- eGFR 56 (today)
- K 4.8 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-114783",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-11-07T12:00:00-06:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-114783",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-114783",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-114783",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-114783",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 144,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-07T12:04:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-114783",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-07T12:04:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-114783",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 79,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-07T12:04:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-114783",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 83.4,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-07T12:02:00-06:00"
  }
}
```
