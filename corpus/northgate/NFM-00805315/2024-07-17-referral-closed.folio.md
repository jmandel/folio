---
folio: "0.1"
id: "01J30FYG20MDX9TD4387THXPA2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00805315"
effective: "2024-07-17T09:00:00-05:00"
recorded: "2024-07-17T09:01:12-05:00"
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
    "referral_id": "RF-2024-0430",
    "action": "closed",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 272 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0430",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2024-0430",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
