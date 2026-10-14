---
folio: "0.1"
id: "01HP5JX2Z0FSCJ8Q7SF58SZ2VQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00917111"
effective: "2024-02-08T15:13:00-06:00"
recorded: "2024-02-08T18:05:00-06:00"
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

metformin: held today (vomiting, poor oral intake); review 2024-02-15

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-020848",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
