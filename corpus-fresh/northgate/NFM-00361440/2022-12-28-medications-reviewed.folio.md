---
folio: "0.1"
id: "01GNDBPWG0DV8Y9EJRSZKFJMAR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00361440"
effective: "2022-12-28T15:55:00-06:00"
recorded: "2022-12-28T15:55:12-06:00"
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
    "lines_on_list": ["ML-18658", "ML-21979", "ML-48151", "ML-41157", "ML-46620", "ML-18543", "ML-46245"],
    "visit_id": "V-2022-122876"
  }
}
```
