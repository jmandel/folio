---
folio: "0.1"
id: "01FXNGQNB0FVGNK3CA3Y0ZA2RE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900818"
effective: "2022-03-08T13:40:00-06:00"
recorded: "2022-03-08T13:40:12-06:00"
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
    "lines_on_list": ["PL-17919", "PL-14962", "PL-16267", "PL-15883", "PL-9736"],
    "visit_id": "V-2022-030894"
  }
}
```
