---
folio: "0.1"
id: "01KRCRH3A0Y1WSM78AZSE4DQ8B"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0003043"
effective: "2026-05-11T13:00:00-05:00"
recorded: "2026-05-11T19:14:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 125/80, HR 84, weight 90.1 kg at 2026-05-11 13:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 4 A1), onset 2025-02-11</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2018</ref>
- eGFR 29 (today)
- K 4.3 (today)
- UACR 13 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-108444",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-05-11T13:00:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G4",
    "CKD_A": "A1"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108444",
    "DX_RANK": 1,
    "ICD10CM": "N18.4",
    "DX_TEXT": "Chronic kidney disease, stage 4 (severe)",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108444",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-108444",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 125,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-11T13:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-108444",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-11T13:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-108444",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 84,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-11T13:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-108444",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 90.1,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-11T13:02:00-05:00"
  }
}
```
