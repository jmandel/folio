---
folio: "0.1"
id: "01KWYZKCEGK98JGZJZE4NP3124"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363203"
effective: "2026-07-07T14:06:00-05:00"
recorded: "2026-07-07T14:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.5. Metformin up to 1000 mg BID today.</ref> Pt informed at visit.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-48439",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "A1c 8.5",
    "visit_id": "V-2026-070719"
  }
}
```
