---
folio: "0.1"
id: "01GEFT10J06SQ2MXDZFP6435XD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2022-10-03T13:00:00-05:00"
recorded: "2022-10-03T15:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 123/75, pulse 85, wt 170 lb.
eGFR 45. Metformin changed to 500 mg twice daily today.
RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-100326",
    "visit_type": "office",
    "reason": "Chronic care visit"
  }
}
```
