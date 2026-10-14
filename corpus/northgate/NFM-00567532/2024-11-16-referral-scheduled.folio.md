---
folio: "0.1"
id: "01JCVE6580N0YJRXQ1PDG8TC60"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00567532"
effective: "2024-11-16T15:30:00-06:00"
recorded: "2024-11-16T15:31:12-06:00"
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
    "referral_id": "RF-2024-0706",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 530 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2025-01-20"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0706",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0706",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
