---
folio: "0.1"
id: "01FGMWRC109W06J7APS9Y0P50V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00155300"
effective: "2021-09-27T15:47:00-05:00"
recorded: "2021-09-27T19:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick with vomiting, not taking much by mouth.
Metformin held today (vomiting, poor oral intake). Will review 10/4.
Advised to call back if worse or unable to keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092727",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
