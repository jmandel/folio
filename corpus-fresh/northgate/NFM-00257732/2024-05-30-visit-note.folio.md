---
folio: "0.1"
id: "01HZ5JWJY0AB0Z32E8QDK8PDAT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2024-05-30T13:30:00-05:00"
recorded: "2024-05-30T15:26:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No hypoglycemia, no new concerns.
BP 133/77, pulse 72, wt 170 lb.
Continue current plan.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-053084",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
