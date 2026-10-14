---
folio: "0.1"
id: "01M0BM5AG06P7CCKTNZWG75W3C"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0009187"
effective: "2026-08-18T14:40:00-05:00"
recorded: "2026-08-18T18:44:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 115/80, HR 67, weight 98.2 kg at 2026-08-18 14:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A3), onset 2023-08-16</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2016</ref>
- eGFR 37 (today)
- K 4.5 (today)
- UACR 700 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-100997",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-08-18T14:40:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3b",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100997",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100997",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-100997",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 115,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-18T14:44:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-100997",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-18T14:44:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-100997",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 67,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-18T14:44:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-100997",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 98.2,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-18T14:42:00-05:00"
  }
}
```
