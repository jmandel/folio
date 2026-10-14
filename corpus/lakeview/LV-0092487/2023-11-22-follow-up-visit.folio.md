---
folio: "0.1"
id: "01HFWK6W90JV2MA04TXEJDQ7YZ"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0092487"
effective: "2023-11-22T10:40:00-06:00"
recorded: "2023-11-22T16:43:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 120/80, HR 81, weight 101 kg at 2023-11-22 10:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A2), onset 2023-04-10</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2018</ref>
- eGFR 39 (today)
- K 4.2 (today)
- UACR 55 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-111420",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2023-11-22T10:40:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-111420",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-111420",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-111420",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 120,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-11-22T10:44:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-111420",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-11-22T10:44:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-111420",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 81,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2023-11-22T10:44:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-111420",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 101,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-11-22T10:42:00-06:00"
  }
}
```
