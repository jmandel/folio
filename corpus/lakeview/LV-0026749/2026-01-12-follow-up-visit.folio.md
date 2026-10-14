---
folio: "0.1"
id: "01KESVYNS0CY8GQ53A6FE4YA3G"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0026749"
effective: "2026-01-12T09:40:00-06:00"
recorded: "2026-01-12T13:47:00-06:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 134/80, HR 77, weight 101.3 kg at 2026-01-12 09:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A3), onset 2019-09-17</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2016</ref>
- <ref id="dx_htn">Essential hypertension, onset 2008</ref>
- eGFR 35 (today)
- K 5.3 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-115064",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-01-12T09:40:00-06:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3b",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-115064",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-115064",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-115064",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-115064",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 134,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-12T09:44:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-115064",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-12T09:44:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-115064",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 77,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-12T09:44:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-115064",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 101.3,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-01-12T09:42:00-06:00"
  }
}
```
