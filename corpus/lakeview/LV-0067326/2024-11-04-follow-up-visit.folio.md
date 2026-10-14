---
folio: "0.1"
id: "01JBWDB5C0Q44B8ZFCMSKR7BAE"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0067326"
effective: "2024-11-04T09:40:00-06:00"
recorded: "2024-11-04T14:20:00-06:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252"
---
Follow-up. <ref id="dx_ckd">CKD G3b A2</ref>, <ref id="dx_dm">diabetic</ref> and <ref id="dx_htn">hypertensive</ref>.

<ref id="bp_sys">BP 144/80, HR 78, weight 96.5 kg.</ref> BP above goal today. No symptoms reported.

eGFR 41, K 4.2, UACR 111 mg/g today.

Home BP log requested. Return in 3 to 4 months.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-119553",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-11-04T09:40:00-06:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-119553",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-119553",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-119553",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-119553",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 144,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-04T09:44:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-119553",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-04T09:44:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-119553",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 78,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-04T09:44:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-119553",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 96.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-11-04T09:42:00-06:00"
  }
}
```
