---
folio: "0.1"
id: "01GS8P2PH07HMRMBJJQD9G312R"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0010850"
effective: "2023-02-14T08:40:00-06:00"
recorded: "2023-02-14T13:23:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 130/80, HR 63, weight 80.7 kg at 2023-02-14 08:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A2), onset 2019-11-03</ref>
- <ref id="dx_htn">Essential hypertension, onset 2014</ref>
- eGFR 39 (today)
- K 4.7 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-115844",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2023-02-14T08:40:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-115844",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-115844",
    "DX_RANK": 2,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-115844",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 130,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-02-14T08:44:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-115844",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-02-14T08:44:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-115844",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 63,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2023-02-14T08:44:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-115844",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 80.7,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-02-14T08:42:00-06:00"
  }
}
```
