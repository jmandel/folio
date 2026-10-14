---
folio: "0.1"
id: "01J5V3A1C02CJKMCT8PW8HHW9V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00283863"
effective: "2024-08-21T13:30:00-05:00"
recorded: "2024-08-21T13:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:kfoster"
  name: "Kim Foster, RN"
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
    "referral_id": "RF-2024-0757",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 33, UACR 9 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2024-10-04"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0757",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0757",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  }
}
```
