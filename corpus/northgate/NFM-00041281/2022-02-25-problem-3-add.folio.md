---
folio: "0.1"
id: "01FWRWEKX0DTNQRHB6E98SN6ZD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00041281"
effective: "2022-02-25"
recorded: "2022-02-25T10:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10676",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2022-022522"
  }
}
```
