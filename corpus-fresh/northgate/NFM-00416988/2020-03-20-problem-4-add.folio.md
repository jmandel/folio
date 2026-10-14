---
folio: "0.1"
id: "01E3W2VQ20VMWF2MGFS6BR3KVM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2020-03-20"
recorded: "2020-03-20T08:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee, onset 2015 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9995",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2020-032095"
  }
}
```
