---
folio: "0.1"
id: "01K8VN2D10K5DY594SN4GWYWKR"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0067326"
effective: "2025-10-30T11:00:00-05:00"
recorded: "2025-10-30T17:51:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 143/80, HR 85, weight 97 kg at 2025-10-30 11:04</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A2), onset 2020-01-09</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2013</ref>
- <ref id="dx_htn">Essential hypertension, onset 2016</ref>
- eGFR 38 (today)
- K 4.5 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-109804",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-10-30T11:00:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-109804",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-109804",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-109804",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-109804",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 143,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-10-30T11:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-109804",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-10-30T11:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-109804",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 85,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-10-30T11:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-109804",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 97,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-10-30T11:02:00-05:00"
  }
}
```
