---
folio: "0.1"
id: "01KJRPFQ9017Y94MNTM5CC6SCX"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0043207"
effective: "2026-03-02T14:40:00-06:00"
recorded: "2026-03-02T19:55:00-06:00"
author:
  id: "npi:1999000066"
  name: "Tobi Adeyemi, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 142/80, HR 87, weight 101.9 kg at 2026-03-02 14:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3a A2), onset 2021-06-29</ref>
- <ref id="dx_dm">Type 2 diabetes mellitus, onset 2015</ref>
- <ref id="dx_htn">Essential hypertension, onset 2011-11</ref>
- eGFR 52 (today)
- K 4.1 (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-110933",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2026-03-02T14:40:00-06:00",
    "PROVIDER_NPI": "1999000066",
    "CKD_G": "G3a",
    "CKD_A": "A2"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-110933",
    "DX_RANK": 1,
    "ICD10CM": "N18.31",
    "DX_TEXT": "Chronic kidney disease, stage 3a",
    "DX_STATUS": "A"
  },
  "dx_dm": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-110933",
    "DX_RANK": 2,
    "ICD10CM": "E11.22",
    "DX_TEXT": "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-110933",
    "DX_RANK": 3,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-110933",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 142,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-03-02T14:44:00-06:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-110933",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-03-02T14:44:00-06:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-110933",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 87,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2026-03-02T14:44:00-06:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-110933",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 101.9,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2026-03-02T14:42:00-06:00"
  }
}
```
