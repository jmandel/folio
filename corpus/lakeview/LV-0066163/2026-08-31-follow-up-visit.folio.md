---
folio: "0.1"
id: "01M1CN0X20XMCF4DJXB97P5303"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0066163"
effective: "2026-08-31T11:00:00-05:00"
recorded: "2026-08-31T14:34:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 133/80, HR 63, weight 85.2 kg at 2026-08-31 11:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A2), onset 2025-04-09</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2014</ref>
- eGFR 35 (today)
- K 4.3 (today)
- UACR 51 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-113669",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-08-31T11:00:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113669",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113669",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-113669",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 133,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-31T11:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-113669",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-31T11:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-113669",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 63,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-31T11:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-113669",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 85.2,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-31T11:02:00-05:00"
  }
}
```
