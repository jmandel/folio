---
folio: "0.1"
id: "01ENKK4VW0YF7QYF50QGG848QE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00007594"
effective: "2020-10-26T13:10:00-05:00"
recorded: "2020-10-26T18:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing OK, no new complaints.
BP 130/71, pulse 88, wt 210 lb.
eGFR 76, K 4, LDL 94 mg/dL today.
Reviewed results with pt. Diet and exercise encouraged.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-102647",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
