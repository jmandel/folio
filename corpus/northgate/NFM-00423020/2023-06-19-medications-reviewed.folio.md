---
folio: "0.1"
id: "01H3AFWFN026MWK2CFCQP8CG6F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00423020"
effective: "2023-06-19T13:50:00-05:00"
recorded: "2023-06-19T13:50:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "list": "medications",
    "lines_on_list": ["ML-19045", "ML-28574", "ML-44929", "ML-27123"],
    "visit_id": "V-2023-061979"
  }
}
```
