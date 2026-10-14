---
folio: "0.1"
id: "01HJXYFBH0DT4KQWZB0B09MRRZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00211240"
effective: "2023-12-30T12:05:00-06:00"
recorded: "2023-12-30T12:06:12-06:00"
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
    "referral_id": "RF-2023-0321",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 38, UACR 59 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2024-03-04"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0321",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0321",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
