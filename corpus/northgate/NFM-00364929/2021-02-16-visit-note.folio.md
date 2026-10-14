---
folio: "0.1"
id: "01EYPGJFE0S66REY5VR657YFC4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00364929"
effective: "2021-02-16T11:40:00-06:00"
recorded: "2021-02-16T16:50:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 134/80, pulse 73, wt 247 lb.
Labs 2/13: eGFR 78, K 4.4, LDL 79 mg/dL.
Labs reviewed with pt, stable.
Continue current plan. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-021623",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-021623",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
