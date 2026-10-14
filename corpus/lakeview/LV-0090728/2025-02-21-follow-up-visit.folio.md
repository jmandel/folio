---
folio: "0.1"
id: "01JMN8YXP014YW05NGP80ZSNT4"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0090728"
effective: "2025-02-21T12:40:00-06:00"
recorded: "2025-02-21T16:10:00-06:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 140/80, HR 63, weight 67.2 kg at 2025-02-21 12:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A3), onset 2019-05-30</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2009</ref>
- <ref id="dx_htn">Essential hypertension, onset 2010-04</ref>
- eGFR 35 (today)
- K 4.6 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-102551",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-02-21T12:40:00-06:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3b",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-102551",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-102551",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-102551",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-102551",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 140,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-02-21T12:44:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-102551",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-02-21T12:44:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-102551",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 63,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-02-21T12:44:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-102551",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 67.2,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-02-21T12:42:00-06:00"
  }
}
```
