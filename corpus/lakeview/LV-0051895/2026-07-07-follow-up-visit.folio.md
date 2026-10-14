---
folio: "0.1"
id: "01KWZD5WR03E3SGN3Z9J6MXJ60"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0051895"
effective: "2026-07-07T12:00:00-05:00"
recorded: "2026-07-07T18:04:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
Follow-up. <ref id="dx_ckd">CKD G3a A3</ref>, <ref id="dx_dm">type 2 diabetes</ref>.

<ref id="bp_sys">BP 133/80, HR 80, weight 91.9 kg</ref>. Feels well. Exam unchanged.

eGFR 46 today, K 3.8, UACR 661 mg/g. GFR 49 → 46 since March; albuminuria up from 573.

Return in 3 months with labs.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-104744",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-07-07T12:00:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104744",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104744",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-104744",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 133,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-07-07T12:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-104744",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-07-07T12:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-104744",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 80,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-07-07T12:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-104744",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 91.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-07-07T12:02:00-05:00"
  }
}
```
