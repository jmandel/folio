---
folio: "0.1"
id: "01JQW83VZ0X2KSGFMXR1K9A29W"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0009116"
effective: "2025-04-02T12:40:00-05:00"
recorded: "2025-04-02T16:57:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252"
---
- <ref id="bp_sys">BP 123/80, HR 84, weight 79.1 kg at 2025-04-02 12:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A3), onset 2023-03-14</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2018</ref>
- <ref id="dx_htn">Essential hypertension, onset 2009-06-23</ref>
- eGFR 49 (today)
- K 4.4 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-101187",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-04-02T12:40:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-101187",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-101187",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-101187",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-101187",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 123,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-04-02T12:44:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-101187",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-04-02T12:44:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-101187",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 84,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-04-02T12:44:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-101187",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 79.1,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-04-02T12:42:00-05:00"
  }
}
```
