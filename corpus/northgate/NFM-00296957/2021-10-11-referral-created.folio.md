---
folio: "0.1"
id: "01FHR3CC30CFBP6YW26TDDBX7T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2021-10-11T11:35:00-05:00"
recorded: "2021-10-11T11:36:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Dr. at Lakeview Kidney Care,

Thank you for seeing this patient with type 2 diabetes and chronic kidney disease. <ref id="referral">Most recent eGFR is 66 and UACR is 522 mg/g. I would appreciate your evaluation and help managing the CKD.</ref>

The patient is stable and has no new complaints today. Please send recommendations to our office after the visit, and call with any questions.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1949",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 66, UACR 522 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1949",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1949",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  }
}
```
