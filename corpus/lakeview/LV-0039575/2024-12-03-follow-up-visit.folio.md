---
folio: "0.1"
id: "01JE742EV0VNKXDE0SCHM05BY4"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0039575"
effective: "2024-12-03T10:20:00-06:00"
recorded: "2024-12-03T14:41:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 141/80, HR 73, weight 68.1 kg at 2024-12-03 10:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A2), onset 2022-12-06</ref>
- <ref id="dx_htn">Essential hypertension, onset 2019</ref>
- eGFR 41 (today)
- K 4.3 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-102262",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-12-03T10:20:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-102262",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-102262",
    "DX_RANK": 2,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-102262",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 141,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-03T10:24:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-102262",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-03T10:24:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-102262",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 73,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-03T10:24:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-102262",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 68.1,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-03T10:22:00-06:00"
  }
}
```
