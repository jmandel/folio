---
folio: "0.1"
id: "01EVAEB0Z0NW64V6XAE17WTJSW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2021-01-05T12:30:00-06:00"
recorded: "2021-01-05T17:33:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt feels well, no new concerns.
BP 122/75, pulse 65, wt 170 lb.
Reviewed meds, no changes today.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-010592",
    "visit_type": "office",
    "reason": "Chronic care visit"
  }
}
```
