---
folio: "0.1"
id: "01H26R5020D5BK4M8JAZ4Q7MQG"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0051895"
effective: "2023-06-05T12:20:00-05:00"
recorded: "2023-06-05T16:42:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
Follow-up. <ref id="dx_ckd">CKD G2 A3</ref>, <ref id="dx_dm">type 2 diabetes</ref>.

<ref id="bp_sys">BP 128/80, HR 87, weight 93 kg</ref>. Doing well, no edema.

eGFR 69 today, K 4.1, UACR 398 mg/g. GFR holding; albuminuria higher than last year.

Return in 4 months with labs.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-103825",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2023-06-05T12:20:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G2",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-103825",
    "DX_RANK": 1,
    "ICD10CM": "N18.2",
    "DX_TEXT": "Chronic kidney disease, stage 2 (mild)",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-103825",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-103825",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 128,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-06-05T12:24:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-103825",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-06-05T12:24:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-103825",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 87,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2023-06-05T12:24:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-103825",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 93,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2023-06-05T12:22:00-05:00"
  }
}
```
