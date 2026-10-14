---
folio: "0.1"
id: "01HAQFZ75GRPZAZGP335RMAJ2G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00217374"
effective: "2023-09-19T14:51:00-05:00"
recorded: "2023-09-19T14:51:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">resume losartan: BP above goal.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-19233",
    "action": "resume",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2023-091943"
  }
}
```
