---
folio: "0.1"
id: "01FCP95830VGR48CHF1M3J6XZQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2021-08-09T15:20:00-05:00"
recorded: "2021-08-09T15:20:12-05:00"
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
    "lines_on_list": ["ML-23473", "ML-14458", "ML-21994", "ML-42167", "ML-43494", "ML-16150"],
    "visit_id": "V-2021-080947"
  }
}
```
