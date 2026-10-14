---
folio: "0.1"
id: "01HY0YCT40ADF78P7WYY3023WC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00458711"
effective: "2024-05-16T09:55:00-05:00"
recorded: "2024-05-16T09:55:12-05:00"
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
    "lines_on_list": ["ML-22456", "ML-18057", "ML-24419", "ML-42898"],
    "visit_id": "V-2024-051663"
  }
}
```
