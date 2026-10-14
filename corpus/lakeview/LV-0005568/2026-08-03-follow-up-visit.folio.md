---
folio: "0.1"
id: "01KZ4XCTD0WB7GVH669W6XRF45"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0005568"
effective: "2026-08-03T12:20:00-05:00"
recorded: "2026-08-03T17:55:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252"
---
- <ref id="bp_sys">BP 120/80, HR 83, weight 98.7 kg at 2026-08-03 12:24</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 4 A2), onset 2024-11-03</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2012</ref>
- eGFR 29 (today)
- K 4.8 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-117849",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-08-03T12:20:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G4",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-117849",
    "DX_RANK": 1,
    "ICD10CM": "N18.4",
    "DX_TEXT": "Chronic kidney disease, stage 4 (severe)",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-117849",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-117849",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 120,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-03T12:24:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-117849",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-03T12:24:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-117849",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 83,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-03T12:24:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-117849",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 98.7,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-08-03T12:22:00-05:00"
  }
}
```
