---
folio: "0.1"
id: "01HPJKXT70MXQZZEKSEAQWYXVF"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0051975"
effective: "2024-02-13T13:00:00-06:00"
recorded: "2024-02-13T19:33:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 132/80, HR 87, weight 91.7 kg at 2024-02-13 13:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2024-03-26</ref>
- <ref id="dx_htn">Essential hypertension, onset 2007</ref>
- eGFR 59 (today)
- K 4.5 (today)
- UACR 686 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-108787",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-02-13T13:00:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108787",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108787",
    "DX_RANK": 2,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-108787",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 132,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-13T13:04:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-108787",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-13T13:04:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-108787",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 87,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-13T13:04:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-108787",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 91.7,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-02-13T13:02:00-06:00"
  }
}
```
