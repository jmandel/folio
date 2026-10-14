---
folio: "0.1"
id: "01HAZASMW0ZSXE9J20RDX3M89J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00359511"
effective: "2023-09-22T15:55:00-05:00"
recorded: "2023-09-22T15:55:12-05:00"
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
    "lines_on_list": ["PL-12646", "PL-14204"],
    "visit_id": "V-2023-092272"
  }
}
```
