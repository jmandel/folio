---
folio: "0.1"
id: "01EHT0FJVGENP55RCWN787NEHZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2020-09-09T13:01:00-05:00"
recorded: "2020-09-09T13:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start chlorthalidone: BP above goal.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-16041",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "chlorthalidone 25 MG Oral Tablet", "rxnorm": "197499" },
    "dose": { "value": 12.5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1/2 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2020-090979"
  }
}
```
