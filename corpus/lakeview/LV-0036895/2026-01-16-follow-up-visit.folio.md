---
folio: "0.1"
id: "01KF539PH0PBG32WM3XP92VH2F"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0036895"
effective: "2026-01-16T15:20:00-06:00"
recorded: "2026-01-16T22:27:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 130/80, HR 70, weight 71.1 kg at 2026-01-16 15:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A3), onset 2025-01-28</ref>
- <ref id="dx_htn">Essential hypertension, onset 2016</ref>
- eGFR 39 (today)
- K 4.2 (today)
- UACR 354 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-105766",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-01-16T15:20:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-105766",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-105766",
    "DX_RANK": 2,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-105766",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 130,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-16T15:24:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-105766",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-16T15:24:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-105766",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 70,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-16T15:24:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-105766",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 71.1,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-16T15:22:00-06:00"
  }
}
```
