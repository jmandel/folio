---
folio: "0.1"
id: "01KS1GGN60YMCG5G5BXF2XB453"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0011561"
effective: "2026-05-19T14:20:00-05:00"
recorded: "2026-05-19T20:38:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 129/80, HR 82, weight 98.5 kg at 2026-05-19 14:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2025-01-23</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2015-06</ref>
- <ref id="dx_htn">Essential hypertension, onset 2011-11</ref>
- eGFR 59 (today)
- K 4.4 (today)
- UACR 1127 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-116529",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-05-19T14:20:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-116529",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-116529",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-116529",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-116529",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 129,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-19T14:24:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-116529",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-19T14:24:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-116529",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 82,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-19T14:24:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-116529",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 98.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-19T14:22:00-05:00"
  }
}
```
