---
folio: "0.1"
id: "01GP4HMB20Z6PH5M605DAD6HBB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00361440"
effective: "2023-01-06T16:00:00-06:00"
recorded: "2023-01-06T16:01:12-06:00"
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
    "referral_id": "RF-2022-1077",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 46, UACR 122 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2023-03-08"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1077",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1077",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1077",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
