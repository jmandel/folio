---
folio: "0.1"
id: "01KK9J4RN04K57F7MZDA5Y5ECW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258113"
effective: "2026-03-09T10:05:00-05:00"
recorded: "2026-03-09T10:06:12-05:00"
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
    "referral_id": "RF-2026-0215",
    "action": "scheduled",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 188 mg/g: CKD evaluation and management",
    "urgency": "routine",
    "appointment_on": "2026-04-08"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0215",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2026-0215",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
