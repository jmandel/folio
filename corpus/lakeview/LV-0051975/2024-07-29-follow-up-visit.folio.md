---
folio: "0.1"
id: "01J401TDE0HJHC9PAEDSZ1050Z"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0051975"
effective: "2024-07-29T10:00:00-05:00"
recorded: "2024-07-29T15:10:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 136/80, HR 64, weight 91 kg at 2024-07-29 10:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2024-03-26</ref>
- <ref id="dx_htn">Essential hypertension, onset 2007</ref>
- eGFR 58 (today)
- K 4.1 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-108596",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-07-29T10:00:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108596",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108596",
    "DX_RANK": 2,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-108596",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 136,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-07-29T10:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-108596",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-07-29T10:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-108596",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 64,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-07-29T10:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-108596",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 91,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-07-29T10:02:00-05:00"
  }
}
```
