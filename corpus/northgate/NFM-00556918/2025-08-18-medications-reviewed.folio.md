---
folio: "0.1"
id: "01K2Z9DMH02TR4TKHQP6Z3S2N4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00556918"
effective: "2025-08-18T14:10:00-05:00"
recorded: "2025-08-18T14:10:12-05:00"
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
    "lines_on_list": ["ML-15150", "ML-27850", "ML-11090", "ML-41687", "ML-28743", "ML-11187", "ML-47152"],
    "visit_id": "V-2025-081857"
  }
}
```
