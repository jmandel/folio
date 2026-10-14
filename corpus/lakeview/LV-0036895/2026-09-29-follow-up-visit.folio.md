---
folio: "0.1"
id: "01M3QN9ZP0FT7S3WE26RKT81PX"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0036895"
effective: "2026-09-29T11:00:00-05:00"
recorded: "2026-09-29T17:42:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 133/80, HR 86, weight 72.1 kg at 2026-09-29 11:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A3), onset 2025-01-28</ref>
- <ref id="dx_htn">Essential hypertension, onset 2016</ref>
- eGFR 32 (today)
- K 5 (today)
- UACR 402 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-116247",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-09-29T11:00:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-116247",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-116247",
    "DX_RANK": 2,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-116247",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 133,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-09-29T11:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-116247",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-09-29T11:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-116247",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 86,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-09-29T11:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-116247",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 72.1,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-09-29T11:02:00-05:00"
  }
}
```
