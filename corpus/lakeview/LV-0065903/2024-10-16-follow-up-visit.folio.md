---
folio: "0.1"
id: "01JABN99C0XB53HS4DMC8RBZ2V"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0065903"
effective: "2024-10-16T13:00:00-05:00"
recorded: "2024-10-16T16:56:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 127/80, HR 76, weight 59.6 kg at 2024-10-16 13:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2023-02-07</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2010</ref>
- eGFR 52 (today)
- K 4.2 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-100665",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-10-16T13:00:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100665",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100665",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-100665",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 127,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-10-16T13:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-100665",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-10-16T13:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-100665",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 76,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-10-16T13:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-100665",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 59.6,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-10-16T13:02:00-05:00"
  }
}
```
