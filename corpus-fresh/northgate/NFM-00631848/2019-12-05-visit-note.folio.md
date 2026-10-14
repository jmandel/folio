---
folio: "0.1"
id: "01DVC97QW0A91HW2J4ZE5YYH49"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2019-12-05T12:00:00-06:00"
recorded: "2019-12-05T18:20:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing well, no new complaints.
BP 129/78, pulse 85, wt 226 lb.
eGFR 77, K 3.8 today.
Labs reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-120587",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
