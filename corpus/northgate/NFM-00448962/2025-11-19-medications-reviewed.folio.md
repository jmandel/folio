---
folio: "0.1"
id: "01KAEKT0107KQAMJQSGEN5QFZT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00448962"
effective: "2025-11-19T11:50:00-06:00"
recorded: "2025-11-19T11:50:12-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "lines_on_list": ["ML-10510", "ML-25653", "ML-20147", "ML-12028", "ML-47933", "ML-43828", "ML-41755", "ML-41809"],
    "visit_id": "V-2025-111971"
  }
}
```
