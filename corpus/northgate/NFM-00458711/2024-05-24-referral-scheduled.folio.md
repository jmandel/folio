---
folio: "0.1"
id: "01HYNHXHP0MS3A69E284NPW7FH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00458711"
effective: "2024-05-24T10:00:00-05:00"
recorded: "2024-05-24T10:01:12-05:00"
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
    "referral_id": "RF-2024-0598",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 51, UACR 384 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2024-07-29"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0598",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0598",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0598",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
