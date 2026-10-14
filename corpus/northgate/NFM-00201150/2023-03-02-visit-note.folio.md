---
folio: "0.1"
id: "01GTJ8M7009PZHRPZ84R7P58XB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2023-03-02T12:16:00-06:00"
recorded: "2023-03-02T16:56:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: feeling better.

metformin: resumed today (eating and drinking normally)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-030258",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
