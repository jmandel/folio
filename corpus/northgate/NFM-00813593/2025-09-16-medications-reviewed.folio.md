---
folio: "0.1"
id: "01K59YYFH0XF4ARBRH4F4W5HR5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813593"
effective: "2025-09-16T14:10:00-05:00"
recorded: "2025-09-16T14:10:12-05:00"
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
    "lines_on_list": ["ML-39601", "ML-46145", "ML-14267", "ML-48064", "ML-17838", "ML-49467"],
    "visit_id": "V-2025-091683"
  }
}
```
