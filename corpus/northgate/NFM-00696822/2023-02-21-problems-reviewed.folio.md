---
folio: "0.1"
id: "01GSTK8QV0MTYAS0RTBT18MB91"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696822"
effective: "2023-02-21T12:20:00-06:00"
recorded: "2023-02-21T12:20:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "review": {
    "type": "list_reviewed",
    "list": "problems",
    "lines_on_list": ["PL-17291", "PL-12995", "PL-11881"],
    "visit_id": "V-2023-022166"
  }
}
```
