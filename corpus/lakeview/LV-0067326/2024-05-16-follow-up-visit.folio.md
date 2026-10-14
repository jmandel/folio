---
folio: "0.1"
id: "01HY1SGBV0TQXYP0AETDKT9RN8"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0067326"
effective: "2024-05-16T13:40:00-05:00"
recorded: "2024-05-16T17:49:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252"
---
Follow-up for <ref id="dx_ckd">CKD G3b A2</ref>, <ref id="dx_dm">type 2 diabetes</ref> and <ref id="dx_htn">hypertension</ref>.

<ref id="bp_sys">BP 138/80, HR 64, weight 97.5 kg.</ref> Feels well. No edema on exam.

eGFR 45 and K 4.6 today. Kidney function steady.

Repeat labs and return in 5 to 6 months.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-100811",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-05-16T13:40:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100811",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100811",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100811",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-100811",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 138,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-16T13:44:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-100811",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-16T13:44:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-100811",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 64,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-16T13:44:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-100811",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 97.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-05-16T13:42:00-05:00"
  }
}
```
