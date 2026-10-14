---
folio: "0.1"
id: "01FQ7CPND0XQN2X66MM01XX0DW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00883307"
effective: "2021-12-18T12:25:00-06:00"
recorded: "2021-12-18T12:26:12-06:00"
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
    "referral_id": "RF-2021-1747",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 41, UACR 207 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2022-01-14"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1747",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1747",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1747",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
