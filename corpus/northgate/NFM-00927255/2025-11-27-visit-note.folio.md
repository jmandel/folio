---
folio: "0.1"
id: "01KB376PP02R5MQF7GBK488MQ6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927255"
effective: "2025-11-27T08:15:00-06:00"
recorded: "2025-11-27T11:54:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Feels well, no complaints.

BP 121/68, pulse 84, wt 179 lb.

BP controlled, no changes today.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-112756",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-112756",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
