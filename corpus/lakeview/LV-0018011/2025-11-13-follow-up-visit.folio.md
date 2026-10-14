---
folio: "0.1"
id: "01K9ZBBR2080D4Y1F25FN8CRT8"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0018011"
effective: "2025-11-13T09:00:00-06:00"
recorded: "2025-11-13T13:34:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 119/80, HR 74, weight 90.3 kg at 2025-11-13 09:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A2), onset 2023-05-10</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2013</ref>
- eGFR 42 (today)
- K 4.5 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-101856",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-11-13T09:00:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-101856",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-101856",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-101856",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 119,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-11-13T09:04:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-101856",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-11-13T09:04:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-101856",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 74,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-11-13T09:04:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-101856",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 90.3,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-11-13T09:02:00-06:00"
  }
}
```
