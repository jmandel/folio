---
folio: "0.1"
id: "01GQ5P4QX02N9THNSDH554BA4G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00217374"
effective: "2023-01-19T10:13:00-06:00"
recorded: "2023-01-19T12:55:00-06:00"
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

losartan: held today (vomiting, poor oral intake); review 2023-01-26

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011982",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
