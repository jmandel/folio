---
folio: "0.1"
id: "01HZ0GAJ30J3EBTQV39ACB7774"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0093118"
effective: "2024-05-28T12:00:00-05:00"
recorded: "2024-05-28T16:05:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 130/80, HR 74, weight 80.2 kg at 2024-05-28 12:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 2 A3), onset 2024-11-26</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2012</ref>
- eGFR 60 (today)
- K 3.9 (today)
- UACR 873 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-119241",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-05-28T12:00:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G2",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-119241",
    "DX_RANK": 1,
    "ICD10CM": "N18.2",
    "DX_TEXT": "Chronic kidney disease, stage 2 (mild)",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-119241",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-119241",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 130,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-28T12:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-119241",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-28T12:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-119241",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 74,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-28T12:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-119241",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 80.2,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-28T12:02:00-05:00"
  }
}
```
