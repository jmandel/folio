---
folio: "0.1"
id: "01FXB1ZZX086QDGE0WM4J6TSA0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00171449"
effective: "2022-03-04T12:10:00-06:00"
recorded: "2022-03-04T12:10:12-06:00"
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
    "list": "medications",
    "lines_on_list": ["ML-15152", "ML-41891", "ML-48276", "ML-16291", "ML-27361"],
    "visit_id": "V-2022-030457"
  }
}
```
