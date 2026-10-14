---
folio: "0.1"
id: "01ERJ5K5X01XB3PMFFA9R8ZJAV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00933357"
effective: "2020-12-02"
recorded: "2020-12-02T10:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 5/2020 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10430",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2020-05-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2020-120221"
  }
}
```
