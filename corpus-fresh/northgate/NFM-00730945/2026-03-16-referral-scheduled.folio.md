---
folio: "0.1"
id: "01KKVJBFQ0E2TD80M9T3EHG781"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2026-03-16T09:55:00-05:00"
recorded: "2026-03-16T09:56:12-05:00"
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
    "referral_id": "RF-2026-1171",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 50, UACR 22 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2026-05-15"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1171",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1171",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2026-1171",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
