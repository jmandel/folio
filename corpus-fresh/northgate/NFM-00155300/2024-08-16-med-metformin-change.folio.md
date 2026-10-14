---
folio: "0.1"
id: "01J5EFY0QG260NGDJZ5GMWN23N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00155300"
effective: "2024-08-16T16:01:00-05:00"
recorded: "2024-08-16T16:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.2. Metformin increased to 1000 mg twice daily today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-27369",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2024-081642"
  }
}
```
