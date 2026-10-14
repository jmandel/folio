---
folio: "0.1"
id: "01HCJ8THA0VSPC9MCGM5Z7KRGB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00352869"
effective: "2023-10-12"
recorded: "2023-10-12T10:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hypothyroidism, onset 12/2012.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13271",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "snomed": "40930008",
    "onset": { "date": "2012-12-01", "precision": "month" },
    "visit_id": "V-2023-101263"
  }
}
```
