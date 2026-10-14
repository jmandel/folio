---
folio: "0.1"
id: "01H8CS8V00DQK8X0ZHMWT4969B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165697"
effective: "2023-08-21T14:30:00-05:00"
recorded: "2023-08-21T14:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

<ref id="referral">I am referring this patient for evaluation and management of chronic kidney disease. Most recent eGFR is 59 with UACR 311 mg/g.</ref>

The patient has chronic kidney disease stage 3a and type 2 diabetes mellitus. Both are followed here in primary care. Recent results are as above, and I am happy to send further records on request.

Thank you for seeing this patient. Please send your recommendations when you have them.

Sincerely,
Dr. Reyes

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0421",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 59, UACR 311 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0421",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0421",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
