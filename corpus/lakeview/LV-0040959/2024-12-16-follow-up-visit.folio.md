---
folio: "0.1"
id: "01JF8WCRV013065B9GMBT9J4AH"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0040959"
effective: "2024-12-16T12:20:00-06:00"
recorded: "2024-12-16T17:21:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 134/80, HR 73, weight 101.9 kg at 2024-12-16 12:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A3), onset 2021-05-17</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2018-06</ref>
- <ref id="dx_htn">Essential hypertension, onset 2010-12</ref>
- eGFR 41 (today)
- K 4.7 (today)
- UACR 799 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-108323",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-12-16T12:20:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108323",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108323",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108323",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-108323",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 134,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-16T12:24:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-108323",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-16T12:24:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-108323",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 73,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-16T12:24:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-108323",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 101.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-16T12:22:00-06:00"
  }
}
```
