---
folio: "0.1"
id: "01GZQ4JS40AC7CMGK5KXX37X55"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00994489"
effective: "2023-05-05T14:20:00-05:00"
recorded: "2023-05-05T18:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 137/88, pulse 86, wt 216 lb.
Labs 5/1: eGFR 72, K 4.8.
Wt stable. Encouraged exercise.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-050552",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-050552",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
