---
folio: "0.1"
id: "01KSNX7G30XMCF4DJXB97P5303"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0066163"
effective: "2026-05-27T15:00:00-05:00"
recorded: "2026-05-27T18:45:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252"
---
Follow-up. <ref id="dx_ckd">CKD G3b A2</ref>, diabetic.

eGFR 35 today, K 4.6. Unchanged from the last visit.

<ref id="bp_sys">BP 134/80, HR 63, weight 83.5 kg.</ref> No complaints, no edema. We discussed the course of her <ref id="dx_dm">type 2 diabetes</ref> and kidney disease together.

Return in 3 to 4 months with labs.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-113669",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-05-27T15:00:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113669",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113669",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-113669",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 134,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-27T15:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-113669",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-27T15:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-113669",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 63,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-27T15:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-113669",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 83.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-27T15:02:00-05:00"
  }
}
```
