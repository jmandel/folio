---
folio: "0.1"
id: "01JYF2K2K0SX5GSR499YH8SBRA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00485742"
effective: "2025-06-23T14:00:00-05:00"
recorded: "2025-06-23T14:00:12-05:00"
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
    "lines_on_list": ["ML-18569", "ML-15184", "ML-22581", "ML-15296", "ML-42855", "ML-24514", "ML-15203"],
    "visit_id": "V-2025-062399"
  }
}
```
