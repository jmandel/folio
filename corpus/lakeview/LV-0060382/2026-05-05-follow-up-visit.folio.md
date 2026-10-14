---
folio: "0.1"
id: "01KQWZYVM0CRMVV0ZEHKBQD2XQ"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0060382"
effective: "2026-05-05T12:00:00-05:00"
recorded: "2026-05-05T16:16:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252"
---
<ref id="dx_ckd">CKD G4 A2</ref>, now stage 4. Feels well, no nausea or itching.

eGFR 30 today, K 4.4. Down from G3b range.

<ref id="bp_sys">BP 139/80, HR 77, weight 54.3 kg.</ref> <ref id="dx_htn">Hypertension</ref> and <ref id="dx_dm">type 2 diabetes</ref> contribute. Discussed what the stage change means.

Return in 3 months with labs.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-100052",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-05-05T12:00:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G4",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100052",
    "DX_RANK": 1,
    "ICD10CM": "N18.4",
    "DX_TEXT": "Chronic kidney disease, stage 4 (severe)",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100052",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-100052",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-100052",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 139,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-05T12:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-100052",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-05T12:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-100052",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 77,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-05T12:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-100052",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 54.3,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-05-05T12:02:00-05:00"
  }
}
```
