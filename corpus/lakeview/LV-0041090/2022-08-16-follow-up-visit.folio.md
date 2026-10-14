---
folio: "0.1"
id: "01GAMS4SC0QYYC2ME7W84D77E2"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0041090"
effective: "2022-08-16T15:20:00-05:00"
recorded: "2022-08-16T21:12:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 137/80, HR 68, weight 74.5 kg at 2022-08-16 15:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A2), onset 2021-03-31</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2009</ref>
- <ref id="dx_htn">Essential hypertension, onset 2013-06-15</ref>
- eGFR 43 (today)
- K 4.8 (today)
- UACR 168 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-106297",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2022-08-16T15:20:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-106297",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-106297",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-106297",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-106297",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 137,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-08-16T15:24:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-106297",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-08-16T15:24:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-106297",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 68,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2022-08-16T15:24:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-106297",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 74.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-08-16T15:22:00-05:00"
  }
}
```
