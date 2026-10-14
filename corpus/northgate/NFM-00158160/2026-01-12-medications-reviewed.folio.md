---
folio: "0.1"
id: "01KESG40K0SX8ZRCE9JBBY4RWJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00158160"
effective: "2026-01-12T10:20:00-06:00"
recorded: "2026-01-12T10:20:12-06:00"
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
    "lines_on_list": ["ML-20083", "ML-42139", "ML-18334", "ML-30943", "ML-37637", "ML-26243", "ML-18039"],
    "visit_id": "V-2026-011281"
  }
}
```
