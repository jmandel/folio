---
folio: "0.1"
id: "01J8TMF8H0QCP6KAXKRRWMWYSZ"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0041841"
effective: "2024-09-27T10:00:00-05:00"
recorded: "2024-09-27T15:59:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 136/80, HR 76, weight 59.9 kg at 2024-09-27 10:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 2 A3), onset 2025-05-21</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2017</ref>
- <ref id="dx_htn">Essential hypertension, onset 2011</ref>
- eGFR 60 (today)
- K 4.5 (today)
- UACR 477 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-107869",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-09-27T10:00:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G2",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-107869",
    "DX_RANK": 1,
    "ICD10CM": "N18.2",
    "DX_TEXT": "Chronic kidney disease, stage 2 (mild)",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-107869",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-107869",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-107869",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 136,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-27T10:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-107869",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-27T10:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-107869",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 76,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-27T10:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-107869",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 59.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-27T10:02:00-05:00"
  }
}
```
