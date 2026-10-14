---
folio: "0.1"
id: "01JMWVNPSG9JD3Y4M91PC9V0WR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00556918"
effective: "2025-02-24T14:51:00-06:00"
recorded: "2025-02-24T14:51:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start insulin glargine: A1c 7.8.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-47152",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "insulin glargine 100 UNT/ML Pen Injector", "rxnorm": "847230" },
    "dose": { "value": 10, "unit": "units" },
    "frequency": "QHS",
    "sig": "Inject 10 units under the skin at bedtime",
    "reason_text": "A1c 7.8",
    "visit_id": "V-2025-022471"
  }
}
```
