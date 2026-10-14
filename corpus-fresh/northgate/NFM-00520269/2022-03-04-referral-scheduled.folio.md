---
folio: "0.1"
id: "01FXB41X900D9F2VP1DZ721213"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00520269"
effective: "2022-03-04T12:45:00-06:00"
recorded: "2022-03-04T12:46:12-06:00"
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
    "referral_id": "RF-2022-0486",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 46, UACR 639 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2022-04-14"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0486",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2022-0486",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
