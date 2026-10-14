---
folio: "0.1"
id: "01FYZ5YW00RRBE3GM2E7T0G5P1"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0051895"
effective: "2022-03-24T12:00:00-05:00"
recorded: "2022-03-24T19:00:00-05:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
Follow-up. <ref id="dx_ckd">CKD G2 A3</ref> in the setting of <ref id="dx_dm">type 2 diabetes</ref>.

<ref id="bp_sys">BP 118/80, HR 71, weight 92.5 kg</ref>. No new complaints, no swelling.

eGFR 69 today, K 4.2. Kidney function steady since the last visit.

Return in about 6 months with labs.

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-108374",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2022-03-24T12:00:00-05:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G2",
    "CKD_A": "A3"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108374",
    "DX_RANK": 1,
    "ICD10CM": "N18.2",
    "DX_TEXT": "Chronic kidney disease, stage 2 (mild)",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-108374",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-108374",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 118,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-03-24T12:04:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-108374",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-03-24T12:04:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-108374",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 71,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2022-03-24T12:04:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-108374",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 92.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2022-03-24T12:02:00-05:00"
  }
}
```
