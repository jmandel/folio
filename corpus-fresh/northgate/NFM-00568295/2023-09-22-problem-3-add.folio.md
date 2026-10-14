---
folio: "0.1"
id: "01HAYS5A907CJPKXXE9CM3A621"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00568295"
effective: "2023-09-22"
recorded: "2023-09-22T10:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2019 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18014",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2023-092219"
  }
}
```
