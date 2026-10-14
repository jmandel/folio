---
folio: "0.1"
id: "01G25FDV80E57YV6YKQ5FY2TVN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2022-05-03T10:15:00-05:00"
recorded: "2022-05-03T12:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Tolerating meds, no hypoglycemia symptoms.
BP 129/72, pulse 77, wt 169 lb.
Diet and exercise reinforced.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-050326",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
