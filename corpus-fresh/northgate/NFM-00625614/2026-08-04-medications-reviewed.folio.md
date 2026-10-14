---
folio: "0.1"
id: "01KZ73SCE0W0W51A5DR1RSV08F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625614"
effective: "2026-08-04T14:25:00-05:00"
recorded: "2026-08-04T14:25:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
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
    "lines_on_list": ["ML-19980", "ML-32362", "ML-14598", "ML-47729", "ML-12342", "ML-47999", "ML-17924"],
    "visit_id": "V-2026-080485"
  }
}
```
