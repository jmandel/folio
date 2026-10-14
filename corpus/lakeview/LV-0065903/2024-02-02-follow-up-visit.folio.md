---
folio: "0.1"
id: "01HNNTCNW06JERT40VTKWEQ8VP"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0065903"
effective: "2024-02-02T09:20:00-06:00"
recorded: "2024-02-02T15:08:00-06:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 132/80, HR 65, weight 59.9 kg at 2024-02-02 09:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2023-02-07</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2010</ref>
- eGFR 57 (today)
- K 4.3 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-110855",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-02-02T09:20:00-06:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-110855",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-110855",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-110855",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 132,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-02T09:24:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-110855",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-02T09:24:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-110855",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 65,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-02T09:24:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-110855",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 59.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-02T09:22:00-06:00"
  }
}
```
