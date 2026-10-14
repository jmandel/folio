---
folio: "0.1"
id: "01EPCWGJWG21ATEK6FB58QJW4W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00337133"
effective: "2020-11-05T13:00:00-06:00"
recorded: "2020-11-05T13:00:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-25314",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2020-110515"
  }
}
```
