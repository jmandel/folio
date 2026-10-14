---
folio: "0.1"
id: "01H1Q41JP04A8M9EZX3NF05RGX"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0010850"
effective: "2023-05-30T11:00:00-05:00"
recorded: "2023-05-30T15:02:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 131/80, HR 62, weight 80.2 kg at 2023-05-30 11:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A2), onset 2019-11-03</ref>
- <ref id="dx_htn">Essential hypertension, onset 2014</ref>
- eGFR 40 (today)
- K 4.8 (today)
- UACR 85 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-113518",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2023-05-30T11:00:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113518",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113518",
    "DX_RANK": 2,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-113518",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 131,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-05-30T11:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-113518",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-05-30T11:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-113518",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 62,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2023-05-30T11:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-113518",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 80.2,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-05-30T11:02:00-05:00"
  }
}
```
