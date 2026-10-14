---
folio: "0.1"
id: "01HKDTT2P0TAQR7D6S18NKG9H9"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0046825"
effective: "2024-01-05T09:40:00-06:00"
recorded: "2024-01-05T16:10:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 135/80, HR 78, weight 95.9 kg at 2024-01-05 09:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A3), onset 2020-01-22</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2011-02-21</ref>
- <ref id="dx_htn">Essential hypertension, onset 2011</ref>
- eGFR 39 (today)
- K 4.4 (today)
- UACR 389 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-101905",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-01-05T09:40:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-101905",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-101905",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-101905",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-101905",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 135,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-01-05T09:44:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-101905",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-01-05T09:44:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-101905",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 78,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-01-05T09:44:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-101905",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 95.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-01-05T09:42:00-06:00"
  }
}
```
