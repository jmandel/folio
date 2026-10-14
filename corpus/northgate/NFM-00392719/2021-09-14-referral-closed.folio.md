---
folio: "0.1"
id: "01FFJ9S5204MNFSAXQV7FQF4HA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2021-09-14T09:00:00-05:00"
recorded: "2021-09-14T09:01:12-05:00"
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
    "referral_id": "RF-2021-1322",
    "action": "closed",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 43, UACR 248 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1322",
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease stage 3b"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1322",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2021-1322",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
