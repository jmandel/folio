---
folio: "0.1"
id: "01H9KJCDE07P9BF7DW7QCX8DE6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2023-09-05T16:00:00-05:00"
recorded: "2023-09-05T16:01:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Nephrology colleague,

Thank you for seeing this pt with type 2 diabetes, essential hypertension and stage 3a chronic kidney disease. <ref id="referral">Most recent eGFR is 60 with UACR 375 mg/g. Requesting CKD evaluation and management.</ref>

BP and diabetes are being followed here. Please send recommendations after your visit and call with any questions.

Thank you for your help.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0443",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 60, UACR 375 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0443",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0443",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0443",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
