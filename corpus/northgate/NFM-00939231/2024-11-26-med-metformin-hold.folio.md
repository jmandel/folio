---
folio: "0.1"
id: "01JDMJNW2G2Y0DYEATXM1PRJGA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939231"
effective: "2024-11-26T09:50:00-06:00"
recorded: "2024-11-26T09:50:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Vomiting and poor oral intake. Metformin held; review 12/3.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-29146",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2024-12-03"
  }
}
```
