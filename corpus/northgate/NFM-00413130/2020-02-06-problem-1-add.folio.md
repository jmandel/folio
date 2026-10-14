---
folio: "0.1"
id: "01E0E97SV0VHXFR7XYYR1NRKCE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00413130"
effective: "2020-02-06"
recorded: "2020-02-06T16:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13518",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2009-11-02", "precision": "day" },
    "visit_id": "V-2020-020615"
  }
}
```
