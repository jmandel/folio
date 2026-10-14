---
folio: "0.1"
id: "01KD3W2AA07YZXTW1TGJBSFQX8"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0003043"
effective: "2025-12-22T11:00:00-06:00"
recorded: "2025-12-22T14:30:00-06:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 127/80, HR 86, weight 90.9 kg at 2025-12-22 11:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 4 A1), onset 2025-02-11</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2018</ref>
- eGFR 30 (today)
- K 4.2 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-109108",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-12-22T11:00:00-06:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G4",
    "CKD_A": "A1"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-109108",
    "DX_RANK": 1,
    "ICD10CM": "N18.4",
    "DX_TEXT": "Chronic kidney disease, stage 4 (severe)",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-109108",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-109108",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 127,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-12-22T11:04:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-109108",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-12-22T11:04:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-109108",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 86,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-12-22T11:04:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-109108",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 90.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-12-22T11:02:00-06:00"
  }
}
```
