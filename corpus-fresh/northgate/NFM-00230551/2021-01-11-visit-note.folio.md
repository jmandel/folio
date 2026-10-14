---
folio: "0.1"
id: "01EVSNCYZ0ZMFZZ023ZXFNYP5A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2021-01-11T13:34:00-06:00"
recorded: "2021-01-11T15:25:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting and not keeping much down.
Poor oral intake, advised small sips of fluids.
Metformin: held today (vomiting, poor oral intake); review 2021-01-18.
Call back or come in if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-011169",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
