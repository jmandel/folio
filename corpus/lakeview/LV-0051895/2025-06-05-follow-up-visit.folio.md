---
folio: "0.1"
id: "01JX0M3JE0DZA6P0YGW8QMTXCS"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0051895"
effective: "2025-06-05T08:40:00-05:00"
recorded: "2025-06-05T13:02:00-05:00"
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

<ref id="bp_sys">BP 127/80, HR 86, weight 91.1 kg</ref>. No complaints, no swelling.

eGFR 57 today, K 4.1. Continued gradual decline, 60 → 57 over five months.

Return in 5 months with labs.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-116584",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-06-05T08:40:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-116584",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-116584",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-116584",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 127,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-06-05T08:44:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-116584",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-06-05T08:44:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-116584",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 86,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-06-05T08:44:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-116584",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 91.1,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-06-05T08:42:00-05:00"
  }
}
```
