---
folio: "0.1"
id: "01J7F9QN004JZJZSVHW2AR44QY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00040235"
effective: "2024-09-10T15:53:00-05:00"
recorded: "2024-09-10T20:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone f/u. Pt feeling better, vomiting resolved.

Eating and drinking normally, so metformin resumed today.

Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091082",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
