---
folio: "0.1"
id: "01HZ88T95G72HCFPC967VZB2JD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2024-05-31T16:27:00-05:00"
recorded: "2024-05-31T16:27:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "med_id": "ML-12966",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "atorvastatin 80 MG Oral Tablet", "rxnorm": "617314" },
    "dose": { "value": 80, "unit": "mg" },
    "frequency": "QHS",
    "sig": "Take 1 tablet by mouth at bedtime"
  }
}
```
