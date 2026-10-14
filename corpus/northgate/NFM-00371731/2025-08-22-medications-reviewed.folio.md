---
folio: "0.1"
id: "01K3944E5044WEWKKJT7J04GVT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00371731"
effective: "2025-08-22T09:50:00-05:00"
recorded: "2025-08-22T09:50:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "lines_on_list": ["ML-46451", "ML-29837", "ML-41112", "ML-46488", "ML-11176", "ML-23252"],
    "visit_id": "V-2025-082292"
  }
}
```
