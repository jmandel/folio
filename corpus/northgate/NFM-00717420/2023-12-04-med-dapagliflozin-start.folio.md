---
folio: "0.1"
id: "01HGV8R7WG0JV116XFV0ZPC2YX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00717420"
effective: "2023-12-04T14:36:00-06:00"
recorded: "2023-12-04T14:36:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dapagliflozin: A1c 8.3.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-22999",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488574" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.3",
    "visit_id": "V-2023-120418"
  }
}
```
