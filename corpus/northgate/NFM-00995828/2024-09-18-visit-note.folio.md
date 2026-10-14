---
folio: "0.1"
id: "01J83N2HN04RW3YFS7CX59JGJ1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00995828"
effective: "2024-09-18T14:32:00-05:00"
recorded: "2024-09-18T17:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: feeling better.

lisinopril: resumed today (eating and drinking normally)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091868",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
