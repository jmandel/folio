---
folio: "0.1"
id: "01HMW6TVA027F0ZZQNZRC9HH0X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00920167"
effective: "2024-01-23T16:25:00-06:00"
recorded: "2024-01-23T16:25:12-06:00"
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
    "lines_on_list": ["ML-14940", "ML-42403", "ML-15501", "ML-41617", "ML-36393", "ML-33750"],
    "visit_id": "V-2024-012388"
  }
}
```
