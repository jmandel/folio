---
folio: "0.1"
id: "01F9Y3NRW0R6V65B0WWAYAGABS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2021-07-06T09:30:00-05:00"
recorded: "2021-07-06T09:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:nortiz"
  name: "Nina Ortiz, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2021-1600",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 67, UACR 492 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2021-08-23"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1600",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1600",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1600",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
