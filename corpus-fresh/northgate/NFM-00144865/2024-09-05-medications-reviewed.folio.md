---
folio: "0.1"
id: "01J71SG7H0CM1F759PM9VVWP1Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00144865"
effective: "2024-09-05T14:10:00-05:00"
recorded: "2024-09-05T14:10:12-05:00"
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
    "lines_on_list": ["ML-29640", "ML-31549", "ML-28202", "ML-37912", "ML-43203", "ML-10988"],
    "visit_id": "V-2024-090532"
  }
}
```
