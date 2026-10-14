---
folio: "0.1"
id: "01FPB2KXC0F6YBCNTJZ6KWB59J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2021-12-07T12:30:00-06:00"
recorded: "2021-12-07T12:31:12-06:00"
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
    "referral_id": "RF-2021-0720",
    "action": "closed",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 70, UACR 355 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0720",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-0720",
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus"
  }
}
```
