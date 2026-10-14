---
folio: "0.1"
id: "01FJYG4E90PY73Q5TDZWXY6RTN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00076765"
effective: "2021-10-26T09:30:00-05:00"
recorded: "2021-10-26T09:30:12-05:00"
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
    "lines_on_list": ["ML-22231", "ML-13955", "ML-24325", "ML-49340", "ML-21709"],
    "visit_id": "V-2021-102614"
  }
}
```
