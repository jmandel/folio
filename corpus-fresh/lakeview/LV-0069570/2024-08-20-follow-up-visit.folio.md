---
folio: "0.1"
id: "01J5RXHKW09VKJJJ3RDK81M92N"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0069570"
effective: "2024-08-20T11:20:00-05:00"
recorded: "2024-08-20T17:12:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252"
---
Follow-up. <ref id="dx_dm">Type 2 diabetes</ref> and <ref id="dx_htn">hypertension</ref>, now CKD G2 A2.

<ref id="bp_sys">BP 131/80, HR 78, weight 102.1 kg</ref>. No new symptoms.

eGFR 62, K 4 today. Albuminuria category improved from the spring.

Return in 3-4 months.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-100837",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-08-20T11:20:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G2",
    "CKD_A": "A2"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100837",
    "DX_RANK": 1,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100837",
    "DX_RANK": 2,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-100837",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 131,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-08-20T11:24:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-100837",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-08-20T11:24:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-100837",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 78,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-08-20T11:24:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-100837",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 102.1,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-08-20T11:22:00-05:00"
  }
}
```
