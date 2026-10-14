---
folio: "0.1"
id: "01F7YEJCS0H8JT43H9R4M942FT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00503403"
effective: "2021-06-11T16:10:00-05:00"
recorded: "2021-06-11T16:10:12-05:00"
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
    "lines_on_list": ["ML-12554", "ML-30717", "ML-20477", "ML-35993", "ML-22063", "ML-38225", "ML-46192"],
    "visit_id": "V-2021-061145"
  }
}
```
