---
folio: "0.1"
id: "01JZRKMKX06C8QG67V3QTCT4Y9"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0003043"
effective: "2025-07-09T11:40:00-05:00"
recorded: "2025-07-09T17:07:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 138/80, HR 65, weight 90.5 kg at 2025-07-09 11:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A1), onset 2025-02-11</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2018</ref>
- eGFR 31 (today)
- K 4.8 (today)
- UACR 11 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-101175",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-07-09T11:40:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3b",
    "CKD_A": "A1"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-101175",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-101175",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-101175",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 138,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-07-09T11:44:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-101175",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-07-09T11:44:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-101175",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 65,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-07-09T11:44:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-101175",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 90.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-07-09T11:42:00-05:00"
  }
}
```
