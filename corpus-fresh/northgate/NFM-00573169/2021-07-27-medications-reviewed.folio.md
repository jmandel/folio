---
folio: "0.1"
id: "01FBM9CWX0QBWQA7V8P1VXQKXA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00573169"
effective: "2021-07-27T10:30:00-05:00"
recorded: "2021-07-27T10:30:12-05:00"
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
    "lines_on_list": ["ML-22253", "ML-20067", "ML-24376", "ML-13112", "ML-44372", "ML-34460"],
    "visit_id": "V-2021-072771"
  }
}
```
