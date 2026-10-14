---
folio: "0.1"
id: "01KV8WDC408H0EDGPAQXEVK5E0"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0065903"
effective: "2026-06-16T10:20:00-05:00"
recorded: "2026-06-16T13:52:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 141/80, HR 79, weight 60.6 kg at 2026-06-16 10:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A3), onset 2023-02-07</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2010</ref>
- eGFR 39 (today)
- K 4.8 (today)
- UACR 2197 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-107249",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-06-16T10:20:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3b",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-107249",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-107249",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-107249",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 141,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-06-16T10:24:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-107249",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-06-16T10:24:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-107249",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 79,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-06-16T10:24:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-107249",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 60.6,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-06-16T10:22:00-05:00"
  }
}
```
