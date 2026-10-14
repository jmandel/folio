---
folio: "0.1"
id: "01DZMACWK0K8493DJSE8YDHG56"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00800453"
effective: "2020-01-27"
recorded: "2020-01-27T14:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Knee OA since 2013 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9144",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2020-012718"
  }
}
```
