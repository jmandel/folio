---
folio: "0.1"
id: "01G6RQBPS0E911V7FD6K6ZTQ5X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00880931"
effective: "2022-06-29T13:52:00-05:00"
recorded: "2022-06-29T16:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

metformin: held today (vomiting, poor oral intake); review 2022-07-06

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-062943",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
