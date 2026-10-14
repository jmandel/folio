---
folio: "0.1"
id: "01E9XZV9A0R1FQT0MJ3PDRY2HJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00914845"
effective: "2020-06-03"
recorded: "2020-06-03T16:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee, onset 3/2016 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17767",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2016-03-03", "precision": "day" },
    "visit_id": "V-2020-060397"
  }
}
```
