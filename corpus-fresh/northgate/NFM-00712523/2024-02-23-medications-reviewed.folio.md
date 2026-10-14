---
folio: "0.1"
id: "01HQBDZQD08PRVEBVDXWE4RPZ4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00712523"
effective: "2024-02-23T10:50:00-06:00"
recorded: "2024-02-23T10:50:12-06:00"
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
    "lines_on_list": ["ML-22806", "ML-48485", "ML-23389"],
    "visit_id": "V-2024-022375"
  }
}
```
