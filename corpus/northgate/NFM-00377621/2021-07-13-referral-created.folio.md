---
folio: "0.1"
id: "01FAGKM170B4Q5PHNCCZE12TG6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2021-07-13T13:55:00-05:00"
recorded: "2021-07-13T13:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

<ref id="referral">I am referring this patient for CKD evaluation and management. Most recent eGFR 61 with UACR 607 mg/g.</ref>

The patient has type 2 diabetes and chronic kidney disease, followed here in primary care. Albuminuria has persisted on repeat testing while eGFR has stayed fairly stable. I would appreciate your assessment and recommendations for kidney care.

Thank you for seeing this patient. Recent labs are available on request.

Teresa Reyes, MD
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-0468",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 61, UACR 607 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0468",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0468",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  }
}
```
