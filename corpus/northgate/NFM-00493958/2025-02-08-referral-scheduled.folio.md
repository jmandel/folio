---
folio: "0.1"
id: "01JKKEZW60CZ4283A85X7ZNFH6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493958"
effective: "2025-02-08T13:00:00-06:00"
recorded: "2025-02-08T13:01:12-06:00"
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
    "referral_id": "RF-2025-0915",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 44, UACR 136 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2025-03-24"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0915",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0915",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0915",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
