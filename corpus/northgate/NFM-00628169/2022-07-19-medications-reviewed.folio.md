---
folio: "0.1"
id: "01G8BXWAH05QWJJ4435RPJZQ9F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00628169"
effective: "2022-07-19T14:10:00-05:00"
recorded: "2022-07-19T14:10:12-05:00"
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
    "list": "medications",
    "lines_on_list": ["ML-19478", "ML-24639", "ML-23671", "ML-43930", "ML-14886"],
    "visit_id": "V-2022-071945"
  }
}
```
