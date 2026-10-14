---
folio: "0.1"
id: "01FQYQ2Y90ZGSYQK70RR89KY7J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00268144"
effective: "2021-12-27T13:50:00-06:00"
recorded: "2021-12-27T13:50:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
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
    "lines_on_list": ["PL-10619", "PL-11196", "PL-16157", "PL-14586", "PL-13418"],
    "visit_id": "V-2021-122718"
  }
}
```
