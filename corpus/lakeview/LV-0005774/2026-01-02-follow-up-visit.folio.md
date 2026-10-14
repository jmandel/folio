---
folio: "0.1"
id: "01KE0CQMM06REMY54JJRXE39YS"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0005774"
effective: "2026-01-02T11:20:00-06:00"
recorded: "2026-01-02T16:20:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 117/80, HR 62, weight 89.4 kg at 2026-01-02 11:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A3), onset 2020-07-06</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2008</ref>
- eGFR 38 (today)
- K 4.3 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-105255",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-01-02T11:20:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-105255",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-105255",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-105255",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 117,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-02T11:24:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-105255",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-02T11:24:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-105255",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 62,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-02T11:24:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-105255",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 89.4,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-02T11:22:00-06:00"
  }
}
```
