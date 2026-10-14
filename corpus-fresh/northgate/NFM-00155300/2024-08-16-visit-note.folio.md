---
folio: "0.1"
id: "01J5EQ5940Y6QQQRD069K2S7B9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00155300"
effective: "2024-08-16T15:40:00-05:00"
recorded: "2024-08-16T18:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no new complaints.
BP 127/71, pulse 86, wt 195 lb.
8/13 labs: eGFR 70, K 4.3, A1c 8.2%.
Metformin dose changed to 1000 mg twice daily today (A1c 8.2).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-081642",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
