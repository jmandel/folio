---
folio: "0.1"
id: "01EBF109Q0CB47S2DYT81CH6ZB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2020-06-22T10:39:00-05:00"
recorded: "2020-06-22T17:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick with vomiting, not keeping much down, poor oral intake.

Metformin held today (vomiting, poor oral intake). Review 6/29.

Advised small sips of fluids. Call back or go to ED if unable to keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-062292",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
