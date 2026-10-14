---
folio: "0.1"
id: "01JGF43PS0FMDY09F0KAHAM48M"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0009187"
effective: "2024-12-31T08:20:00-06:00"
recorded: "2024-12-31T13:47:00-06:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 104/80, HR 62, weight 99.1 kg at 2024-12-31 08:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2023-08-16</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2016</ref>
- eGFR 53 (today)
- K 4 (today)
- UACR 446 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-118395",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-12-31T08:20:00-06:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-118395",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-118395",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-118395",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 104,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-31T08:24:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-118395",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-31T08:24:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-118395",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 62,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-31T08:24:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-118395",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 99.1,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-12-31T08:22:00-06:00"
  }
}
```
