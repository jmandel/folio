---
folio: "0.1"
id: "01JTPARQX0TZ1D12KM4HMTYDVB"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0089321"
effective: "2025-05-07T11:40:00-05:00"
recorded: "2025-05-07T16:35:00-05:00"
author:
  id: "npi:1999000042"
  name: "Helen Marsh, MD"
  role: "Nephrologist"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "ClinicRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---
- <ref id="bp_sys">BP 121/80, HR 73, weight 103.5 kg at 2025-05-07 11:44</ref>
- <ref id="dx_ckd">Chronic kidney disease (stage 3b A1), onset 2025-04-05</ref>
- <ref id="dx_htn">Essential hypertension, onset 2014</ref>
- eGFR 41 (today)
- K 4.8 (today)
- UACR 13 mg/g (today)

```json payload
{
  "visit": {
    "type": "CLINIC_VISIT",
    "VISIT_ID": "NV-114760",
    "VISIT_TYPE": "FU",
    "VISIT_AT": "2025-05-07T11:40:00-05:00",
    "PROVIDER_NPI": "1999000042",
    "CKD_G": "G3b",
    "CKD_A": "A1"
  },
  "dx_ckd": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-114760",
    "DX_RANK": 1,
    "ICD10CM": "N18.32",
    "DX_TEXT": "Chronic kidney disease, stage 3b",
    "DX_STATUS": "A"
  },
  "dx_htn": {
    "type": "VISIT_DX",
    "VISIT_ID": "NV-114760",
    "DX_RANK": 2,
    "ICD10CM": "I12.9",
    "DX_TEXT": "Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease",
    "DX_STATUS": "A"
  },
  "bp_sys": {
    "type": "VITAL",
    "VISIT_ID": "NV-114760",
    "VITAL_CODE": "BPS",
    "VALUE_NUM": 121,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-05-07T11:44:00-05:00"
  },
  "bp_dia": {
    "type": "VITAL",
    "VISIT_ID": "NV-114760",
    "VITAL_CODE": "BPD",
    "VALUE_NUM": 80,
    "UNIT_CODE": "mmHg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-05-07T11:44:00-05:00"
  },
  "hr": {
    "type": "VITAL",
    "VISIT_ID": "NV-114760",
    "VITAL_CODE": "HR",
    "VALUE_NUM": 73,
    "UNIT_CODE": "/min",
    "READING_NO": 1,
    "TAKEN_AT": "2025-05-07T11:44:00-05:00"
  },
  "wt": {
    "type": "VITAL",
    "VISIT_ID": "NV-114760",
    "VITAL_CODE": "WT",
    "VALUE_NUM": 103.5,
    "UNIT_CODE": "kg",
    "READING_NO": 1,
    "TAKEN_AT": "2025-05-07T11:42:00-05:00"
  }
}
```
