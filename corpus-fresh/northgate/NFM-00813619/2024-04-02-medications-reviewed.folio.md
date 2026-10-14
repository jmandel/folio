---
folio: "0.1"
id: "01HTG62G80FAQSXZKVX60XPTVR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813619"
effective: "2024-04-02T14:55:00-05:00"
recorded: "2024-04-02T14:55:12-05:00"
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
    "lines_on_list": ["ML-15985", "ML-22238"],
    "visit_id": "V-2024-040211"
  }
}
```
