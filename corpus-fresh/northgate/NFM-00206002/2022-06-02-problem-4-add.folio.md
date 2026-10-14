---
folio: "0.1"
id: "01G4K4EQ703X5DYT2E40EJQHCF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00206002"
effective: "2022-06-02"
recorded: "2022-06-02T16:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 7/2010 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13092",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2010-07-14", "precision": "day" },
    "visit_id": "V-2022-060259"
  }
}
```
