---
folio: "0.1"
id: "01JMZJKM90Q5DP4EYZXZSVDKVK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927255"
effective: "2025-02-25T11:45:00-06:00"
recorded: "2025-02-25T16:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No headaches or dizziness.

BP 121/70, pulse 72, wt 179 lb.

BP at goal today. Continue current plan.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-022542",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-022542",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
