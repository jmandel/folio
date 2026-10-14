---
folio: "0.1"
id: "01HP8NHTK08EDGVT91N3N88C8P"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0005774"
effective: "2024-02-09T15:40:00-06:00"
recorded: "2024-02-09T22:49:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 117/80, HR 70, weight 88.9 kg at 2024-02-09 15:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A3), onset 2020-07-06</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2008</ref>
- eGFR 41 (today)
- K 4 (today)
- UACR 440 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-109482",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-02-09T15:40:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-109482",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-109482",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-109482",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 117,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-09T15:44:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-109482",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-09T15:44:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-109482",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 70,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-09T15:44:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-109482",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 88.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-09T15:42:00-06:00"
  }
}
```
