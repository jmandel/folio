---
folio: "0.1"
id: "01KESY4M205Z5EJSZ81P8X58TS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00831906"
effective: "2026-01-12T14:25:00-06:00"
recorded: "2026-01-12T14:25:12-06:00"
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
    "lines_on_list": ["ML-19525", "ML-15945", "ML-12442", "ML-25602", "ML-33835", "ML-46831"],
    "visit_id": "V-2026-011297"
  }
}
```
