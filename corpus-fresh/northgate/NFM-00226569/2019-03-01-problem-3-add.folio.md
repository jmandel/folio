---
folio: "0.1"
id: "01D4XCE5T0E788A7FEGHABY8DY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00226569"
effective: "2019-03-01"
recorded: "2019-03-01T13:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee, onset 2012 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12218",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2012-01-01", "precision": "year" },
    "visit_id": "V-2019-030176"
  }
}
```
