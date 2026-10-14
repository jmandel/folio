---
folio: "0.1"
id: "01FYPR93N02V0GVHTFX52BZ2HS"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0004518"
effective: "2022-03-21T09:00:00-05:00"
recorded: "2022-03-21T12:27:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 145/80, HR 82, weight 80 kg at 2022-03-21 09:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A1), onset 2020-08-31</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2008</ref>
- <ref id="dx_htn">Essential hypertension, onset 2008</ref>
- eGFR 40 (today)
- K 4.6 (today)
- UACR 19 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-112505",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2022-03-21T09:00:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A1"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-112505",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-112505",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-112505",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-112505",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 145,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-03-21T09:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-112505",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-03-21T09:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-112505",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 82,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2022-03-21T09:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-112505",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 80,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-03-21T09:02:00-05:00"
  }
}
```
