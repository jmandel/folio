---
folio: "0.1"
id: "01JRZX1MF0KMQ2T3SMN38R1YWD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00826248"
effective: "2025-04-16T13:15:00-05:00"
recorded: "2025-04-16T13:16:12-05:00"
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
    "referral_id": "RF-2025-1455",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 46, UACR 17 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2025-06-20"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1455",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-1455",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
