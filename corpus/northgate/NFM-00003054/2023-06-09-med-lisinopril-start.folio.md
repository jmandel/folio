---
folio: "0.1"
id: "01H2GZ335G961B6XVN0D66Z1WK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00003054"
effective: "2023-06-09T15:55:00-05:00"
recorded: "2023-06-09T15:55:42-05:00"
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
    "med_id": "ML-23807",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "visit_id": "V-2023-060995"
  }
}
```
