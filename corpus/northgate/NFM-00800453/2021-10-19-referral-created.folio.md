---
folio: "0.1"
id: "01FJD754909E11R31P32P2JB6J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00800453"
effective: "2021-10-19T16:25:00-05:00"
recorded: "2021-10-19T16:26:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

<ref id="referral">I am referring Mr. for evaluation and management of chronic kidney disease. Labs today show eGFR 40 and UACR 284 mg/g.</ref>

The patient has CKD stage 3b and essential hypertension, followed here. Kidney function has been slowly declining, and albuminuria persists. I would appreciate your assessment and recommendations for further management.

Thank you for seeing this patient. Please call with any questions.

Daniel Khan, MD

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0658",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 40, UACR 284 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0658",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0658",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
