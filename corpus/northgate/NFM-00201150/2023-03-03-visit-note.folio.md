---
folio: "0.1"
id: "01GTMVA2Z0NRSR0TPTPF532M6G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2023-03-03T10:59:00-06:00"
recorded: "2023-03-03T17:01:00-06:00"
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
    "visit_id": "V-2023-030388",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
