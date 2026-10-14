---
folio: "0.1"
id: "01E9TKPK40WMC72VVJKJAPMZQZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00874391"
effective: "2020-06-02"
recorded: "2020-06-02T08:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2017.</ref> Hx per pt at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9826",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2020-060258"
  }
}
```
