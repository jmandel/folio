---
folio: "0.1"
id: "01H1PVPKQ05HHHXMWMY1SW0EHG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00358696"
effective: "2023-05-30T12:35:00-05:00"
recorded: "2023-05-30T12:36:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleagues,

Thank you for seeing this patient, who established care with me today. <ref id="referral">eGFR 40 and UACR 181 mg/g today; referring for CKD evaluation and management.</ref>

The patient has chronic kidney disease and a history of essential hypertension, and BP was above goal at today's visit. This is our first visit together, so I have no earlier kidney labs to send. I would appreciate your help with evaluation and ongoing management of the CKD. I will continue to follow BP and routine primary care here.

Please send your recommendations after the visit. Call me with any questions.

Moira Brennan, DO
Northgate Family Medicine

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0279",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 40, UACR 181 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0279",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0279",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
