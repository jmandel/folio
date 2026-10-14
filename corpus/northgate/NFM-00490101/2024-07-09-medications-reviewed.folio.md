---
folio: "0.1"
id: "01J2C59JH0S4YDSX0AV9RM05B2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00490101"
effective: "2024-07-09T11:30:00-05:00"
recorded: "2024-07-09T11:30:12-05:00"
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
    "lines_on_list": ["ML-37416", "ML-43895", "ML-30316"],
    "visit_id": "V-2024-070977"
  }
}
```
