---
folio: "0.1"
id: "01GCEWPRS0JSMC38M5FFRTTYXZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00721565"
effective: "2022-09-08T10:50:00-05:00"
recorded: "2022-09-08T10:50:12-05:00"
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
    "lines_on_list": ["ML-47140", "ML-32602", "ML-32501"],
    "visit_id": "V-2022-090872"
  }
}
```
