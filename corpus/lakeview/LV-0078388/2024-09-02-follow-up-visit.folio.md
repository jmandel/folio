---
folio: "0.1"
id: "01J6TNMKG01W3NMBHQGXE22GZ1"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0078388"
effective: "2024-09-02T13:20:00-05:00"
recorded: "2024-09-02T19:48:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252"
---
Follow-up for <ref id="dx_ckd">CKD G3b A2</ref>, hypertensive (<ref id="dx_htn">essential hypertension since 2017</ref>).

eGFR 34 today, K 4.9. <ref id="bp_sys">BP 122/80, HR 66, weight 89.1 kg</ref>. BP at goal. Feels well, no new complaints, no edema on exam.

Potassium is at the upper end, so we will watch it closely. Repeat K and creatinine in 6 weeks. Return 3 months.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-107226",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2024-09-02T13:20:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-107226",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-107226",
    "DX_RANK": 2,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-107226",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 122,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-02T13:24:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-107226",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-02T13:24:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-107226",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 66,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-02T13:24:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-107226",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 89.1,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2024-09-02T13:22:00-05:00"
  }
}
```
