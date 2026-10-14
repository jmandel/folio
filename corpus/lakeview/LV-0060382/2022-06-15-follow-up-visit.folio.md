---
folio: "0.1"
id: "01G5N39RX003QZWTW1CTFN6N53"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0060382"
effective: "2022-06-15T14:00:00-05:00"
recorded: "2022-06-15T20:51:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 142/80, HR 80, weight 55.4 kg at 2022-06-15 14:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A2), onset 2020-08-04</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2016</ref>
- <ref id="dx_htn">Essential hypertension, onset 2015</ref>
- eGFR 44 (today)
- K 4.5 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-109127",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2022-06-15T14:00:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-109127",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-109127",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-109127",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-109127",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 142,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-06-15T14:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-109127",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-06-15T14:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-109127",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 80,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2022-06-15T14:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-109127",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 55.4,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-06-15T14:02:00-05:00"
  }
}
```
