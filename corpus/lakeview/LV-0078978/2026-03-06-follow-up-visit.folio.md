---
folio: "0.1"
id: "01KK2B8350GJ8G16B6YBS3MJPJ"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0078978"
effective: "2026-03-06T10:20:00-06:00"
recorded: "2026-03-06T13:51:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 121/80, HR 83, weight 71.2 kg at 2026-03-06 10:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A1), onset 2023-11-25</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2020-08-06</ref>
- eGFR 45 (today)
- K 4.3 (today)
- UACR 22 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-104069",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-03-06T10:20:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3a",
    "CKD_A": "A1"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104069",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-104069",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-104069",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 121,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-03-06T10:24:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-104069",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-03-06T10:24:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-104069",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 83,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-03-06T10:24:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-104069",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 71.2,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-03-06T10:22:00-06:00"
  }
}
```
