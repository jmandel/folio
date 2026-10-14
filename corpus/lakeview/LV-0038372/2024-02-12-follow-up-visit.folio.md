---
folio: "0.1"
id: "01HPFKAZZ0GR4TRZKRRT3KZN2F"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0038372"
effective: "2024-02-12T11:00:00-06:00"
recorded: "2024-02-12T15:25:00-06:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 143/80, HR 87, weight 87.3 kg at 2024-02-12 11:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2023-09-27</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2015</ref>
- <ref id="dx_htn">Essential hypertension, onset 2010-11</ref>
- eGFR 59 (today)
- K 4.9 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-115142",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-02-12T11:00:00-06:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-115142",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-115142",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-115142",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-115142",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 143,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-12T11:04:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-115142",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-12T11:04:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-115142",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 87,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-12T11:04:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-115142",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 87.3,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-12T11:02:00-06:00"
  }
}
```
