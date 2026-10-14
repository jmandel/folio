---
folio: "0.1"
id: "01GPCVZH804SMA8YBEH7GKBD9B"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0009116"
effective: "2023-01-09T14:20:00-06:00"
recorded: "2023-01-09T21:36:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 135/80, HR 85, weight 78.9 kg at 2023-01-09 14:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2023-03-14</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2018</ref>
- <ref id="dx_htn">Essential hypertension, onset 2009-06-23</ref>
- eGFR 55 (today)
- K 4.3 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-104100",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2023-01-09T14:20:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104100",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104100",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104100",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-104100",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 135,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-01-09T14:24:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-104100",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-01-09T14:24:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-104100",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 85,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2023-01-09T14:24:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-104100",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 78.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-01-09T14:22:00-06:00"
  }
}
```
