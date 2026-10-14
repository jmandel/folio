---
folio: "0.1"
id: "01K4V1Q3Y06NMK4K3R3J8B9DJV"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0034182"
effective: "2025-09-10T13:20:00-05:00"
recorded: "2025-09-10T19:10:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
Follow-up. <ref id="dx_ckd">CKD G3a A3</ref>, <ref id="dx_dm">diabetic</ref> and <ref id="dx_htn">hypertensive</ref>.

eGFR 52 today, K 4.7. Continued slow decline, 57 → 52 over six months.

<ref id="bp_sys">BP 142/80, HR 70, weight 87.4 kg</ref>. BP above goal. Home readings requested.

Return in 5 months.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-113193",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-09-10T13:20:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113193",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113193",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-113193",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-113193",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 142,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-09-10T13:24:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-113193",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-09-10T13:24:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-113193",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 70,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-09-10T13:24:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-113193",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 87.4,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-09-10T13:22:00-05:00"
  }
}
```
