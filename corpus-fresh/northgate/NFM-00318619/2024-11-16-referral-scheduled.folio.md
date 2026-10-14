---
folio: "0.1"
id: "01JCV05HS0E1RCAEWPJ7HW297M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00318619"
effective: "2024-11-16T11:25:00-06:00"
recorded: "2024-11-16T11:26:12-06:00"
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
    "referral_id": "RF-2024-1764",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 339 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2025-01-06"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1764",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1764",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2024-1764",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
