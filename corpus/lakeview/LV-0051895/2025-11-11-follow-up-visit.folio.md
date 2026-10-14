---
folio: "0.1"
id: "01K9TSEJ005WTBN3FWT4P1JWQT"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0051895"
effective: "2025-11-11T14:40:00-06:00"
recorded: "2025-11-11T19:04:00-06:00"
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

<ref id="bp_sys">BP 125/80, HR 67, weight 92.7 kg</ref>. Feels well. No edema.

eGFR 51 today, K 4.7, UACR 573 mg/g. GFR 57 → 51 since June, a faster drop than before. Albuminuria persists.

Repeat labs in 3 months.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-100170",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-11-11T14:40:00-06:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100170",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100170",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-100170",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 125,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-11-11T14:44:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-100170",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-11-11T14:44:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-100170",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 67,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-11-11T14:44:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-100170",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 92.7,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-11-11T14:42:00-06:00"
  }
}
```
