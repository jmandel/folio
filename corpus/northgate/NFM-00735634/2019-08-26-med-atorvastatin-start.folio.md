---
folio: "0.1"
id: "01DK76B7NGQ8V92JQFG818NNTD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2019-08-26T09:47:00-05:00"
recorded: "2019-08-26T09:47:42-05:00"
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
    "med_id": "ML-47783",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "atorvastatin 40 MG Oral Tablet", "rxnorm": "617311" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime",
    "visit_id": "V-2019-082618"
  }
}
```
