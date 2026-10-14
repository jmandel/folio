---
folio: "0.1"
id: "01KK9H7F50NM4JD4TPJDCDKJ7X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2026-03-09T09:50:00-05:00"
recorded: "2026-03-09T09:50:12-05:00"
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
    "lines_on_list": ["ML-11147", "ML-25457", "ML-49989", "ML-16984", "ML-22313", "ML-40892", "ML-13577"],
    "visit_id": "V-2026-030931"
  }
}
```
