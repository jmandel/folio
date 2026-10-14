---
folio: "0.1"
id: "01DARR36HG4VWX69DJ5R64DVJS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2019-05-13T09:03:00-05:00"
recorded: "2019-05-13T09:03:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-32136",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2019-051326"
  }
}
```
