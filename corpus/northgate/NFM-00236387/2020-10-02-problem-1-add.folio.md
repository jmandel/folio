---
folio: "0.1"
id: "01EKNHBYC0Z3E6ZZ98HXHYWTFT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00236387"
effective: "2020-10-02"
recorded: "2020-10-02T15:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 5/2007 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11106",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2007-05-01", "precision": "month" },
    "visit_id": "V-2020-100297"
  }
}
```
