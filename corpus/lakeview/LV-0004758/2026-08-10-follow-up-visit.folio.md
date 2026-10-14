---
folio: "0.1"
id: "01KZPXTVV0A0TAMY2P6P6NR0DZ"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0004758"
effective: "2026-08-10T10:40:00-05:00"
recorded: "2026-08-10T17:49:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 141/80, HR 66, weight 108 kg at 2026-08-10 10:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2022-06-11</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2009</ref>
- <ref id="dx_htn">Essential hypertension, onset 2016</ref>
- eGFR 49 (today)
- K 4.5 (today)
- UACR 382 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-113056",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-08-10T10:40:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113056",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113056",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113056",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-113056",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 141,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-10T10:44:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-113056",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-10T10:44:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-113056",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 66,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-10T10:44:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-113056",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 108,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-10T10:42:00-05:00"
  }
}
```
