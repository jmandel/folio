---
folio: "0.1"
id: "01HGY00KBGS7CQA1SPW9E209WD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00760692"
effective: "2023-12-05T16:01:00-06:00"
recorded: "2023-12-05T16:01:42-06:00"
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
    "med_id": "ML-27963",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "escitalopram 10 MG Oral Tablet", "rxnorm": "349332" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "restricted": "BH",
    "visit_id": "V-2023-120517"
  }
}
```
