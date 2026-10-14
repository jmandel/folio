---
folio: "0.1"
id: "01J7M202Z0Z9M3Y8177KK5J297"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0093118"
effective: "2024-09-12T10:00:00-05:00"
recorded: "2024-09-12T16:25:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 118/80, HR 72, weight 78.4 kg at 2024-09-12 10:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2024-11-26</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2012</ref>
- eGFR 58 (today)
- K 4.1 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-113420",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-09-12T10:00:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113420",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113420",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-113420",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 118,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-12T10:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-113420",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-12T10:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-113420",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 72,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-12T10:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-113420",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 78.4,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-12T10:02:00-05:00"
  }
}
```
