---
folio: "0.1"
id: "01G6BRM7900Y4QBQVYXKD5RF5P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00465508"
effective: "2022-06-24T13:20:00-05:00"
recorded: "2022-06-24T16:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 125/78, pulse 79, wt 218 lb.
eGFR 93 today. LDL 130 mg/dL today.

Discussed diet and activity. RTC 1 yr or sooner prn.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-062454",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-062454",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
