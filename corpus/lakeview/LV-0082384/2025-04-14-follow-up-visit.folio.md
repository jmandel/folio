---
folio: "0.1"
id: "01JRV37CR0XE4YBW3HXFDV3SW7"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0082384"
effective: "2025-04-14T10:00:00-05:00"
recorded: "2025-04-14T16:28:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 155/80, HR 73, weight 85.5 kg at 2025-04-14 10:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2025-03-06</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2018</ref>
- <ref id="dx_htn">Essential hypertension, onset 2018</ref>
- eGFR 50 (today)
- K 4.7 (today)
- UACR 366 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-112547",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-04-14T10:00:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-112547",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-112547",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-112547",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-112547",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 155,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-04-14T10:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-112547",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-04-14T10:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-112547",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 73,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-04-14T10:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-112547",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 85.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-04-14T10:02:00-05:00"
  }
}
```
