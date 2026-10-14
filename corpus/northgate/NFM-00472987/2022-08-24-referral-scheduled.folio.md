---
folio: "0.1"
id: "01GB8VZ79071KYX29X6YZJQJSK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00472987"
effective: "2022-08-24T16:25:00-05:00"
recorded: "2022-08-24T16:26:12-05:00"
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
    "referral_id": "RF-2022-1132",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 45, UACR 12 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2022-10-03"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1132",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1132",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2022-1132",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
