---
folio: "0.1"
id: "01JC78SAM0WKNK1QGNNN2E6PF7"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0009222"
effective: "2024-11-08T14:20:00-06:00"
recorded: "2024-11-08T19:32:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 137/80, HR 73, weight 69.5 kg at 2024-11-08 14:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A1), onset 2020-04-27</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2010</ref>
- eGFR 47 (today)
- K 4 (today)
- UACR 10 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-113696",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-11-08T14:20:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3a",
    "CKD_A": "A1"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113696",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113696",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-113696",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 137,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-08T14:24:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-113696",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-08T14:24:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-113696",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 73,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-08T14:24:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-113696",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 69.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-08T14:22:00-06:00"
  }
}
```
