---
folio: "0.1"
id: "01EVSFC51G80YMXMXRWA6B1NS1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2021-01-11T13:39:00-06:00"
recorded: "2021-01-11T13:39:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Metformin held, vomiting and poor oral intake.</ref> Will review in a week.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-40629",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2021-01-18"
  }
}
```
