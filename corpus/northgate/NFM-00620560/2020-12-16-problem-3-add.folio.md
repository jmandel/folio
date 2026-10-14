---
folio: "0.1"
id: "01ESP8K0R0HQ3MMGBTFQESYMZ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620560"
effective: "2020-12-16"
recorded: "2020-12-16T11:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee, onset 2019.</ref> History per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15009",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2020-121665"
  }
}
```
