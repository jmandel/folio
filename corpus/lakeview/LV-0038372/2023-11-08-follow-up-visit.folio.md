---
folio: "0.1"
id: "01HERGG6D03E56F4HSWTVKGMDR"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0038372"
effective: "2023-11-08T09:20:00-06:00"
recorded: "2023-11-08T16:23:00-06:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 128/80, HR 76, weight 86.5 kg at 2023-11-08 09:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2023-09-27</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2015</ref>
- <ref id="dx_htn">Essential hypertension, onset 2010-11</ref>
- eGFR 59 (today)
- K 4.5 (today)
- UACR 1149 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-102193",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2023-11-08T09:20:00-06:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-102193",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-102193",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-102193",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-102193",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 128,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-11-08T09:24:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-102193",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-11-08T09:24:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-102193",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 76,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2023-11-08T09:24:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-102193",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 86.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-11-08T09:22:00-06:00"
  }
}
```
