---
folio: "0.1"
id: "01J4SVZ600GKSAK2P52FW25HKV"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0051895"
effective: "2024-08-08T12:00:00-05:00"
recorded: "2024-08-08T15:48:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
Follow-up. <ref id="dx_ckd">CKD G2 A3</ref>, <ref id="dx_dm">type 2 diabetes</ref>.

<ref id="bp_sys">BP 129/80, HR 79, weight 91.8 kg</ref>. No new symptoms.

eGFR 62 today, K 3.8. GFR down from 66 in February.

Return in 5 months with labs, including urine albumin.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-119843",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-08-08T12:00:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G2",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-119843",
    "DX_RANK": 1,
    "ICD10CM": "N18.2",
    "DX_TEXT": "Chronic kidney disease, stage 2 (mild)",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-119843",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-119843",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 129,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-08-08T12:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-119843",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-08-08T12:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-119843",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 79,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-08-08T12:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-119843",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 91.8,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-08-08T12:02:00-05:00"
  }
}
```
