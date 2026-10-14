---
folio: "0.1"
id: "01K1Y68EG0QM5RV0V1XBEWMJMY"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0018011"
effective: "2025-08-05T13:40:00-05:00"
recorded: "2025-08-05T17:40:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252"
---
- <ref id="bp_sys">BP 118/80, HR 82, weight 91.6 kg at 2025-08-05 13:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A2), onset 2023-05-10</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2013</ref>
- eGFR 43 (today)
- K 4.3 (today)
- UACR 124 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-113811",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-08-05T13:40:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113811",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113811",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-113811",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 118,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-08-05T13:44:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-113811",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-08-05T13:44:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-113811",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 82,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-08-05T13:44:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-113811",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 91.6,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-08-05T13:42:00-05:00"
  }
}
```
