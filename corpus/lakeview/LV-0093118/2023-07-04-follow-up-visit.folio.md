---
folio: "0.1"
id: "01H4HGRQ40GEFV9BDAXRR1N32C"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0093118"
effective: "2023-07-04T13:40:00-05:00"
recorded: "2023-07-04T17:36:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 127/80, HR 81, weight 78.9 kg at 2023-07-04 13:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 2 A3), onset 2024-11-26</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2012</ref>
- eGFR 62 (today)
- K 4.1 (today)
- UACR 666 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-103244",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2023-07-04T13:40:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G2",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-103244",
    "DX_RANK": 1,
    "ICD10CM": "N18.2",
    "DX_TEXT": "Chronic kidney disease, stage 2 (mild)",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-103244",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-103244",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 127,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-07-04T13:44:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-103244",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-07-04T13:44:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-103244",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 81,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2023-07-04T13:44:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-103244",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 78.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-07-04T13:42:00-05:00"
  }
}
```
