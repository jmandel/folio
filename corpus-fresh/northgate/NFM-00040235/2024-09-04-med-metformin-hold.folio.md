---
folio: "0.1"
id: "01J6Z4EBXGRF27QN1P7G7ECE3G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00040235"
effective: "2024-09-04T13:23:00-05:00"
recorded: "2024-09-04T13:23:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Metformin held today, vomiting and poor oral intake. Review 9/11.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-11387",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2024-09-11"
  }
}
```
