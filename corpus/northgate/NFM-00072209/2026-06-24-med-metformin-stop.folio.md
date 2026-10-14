---
folio: "0.1"
id: "01KVX9JA6GJRQFTFKBEBWFPTKD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00072209"
effective: "2026-06-24T12:06:00-05:00"
recorded: "2026-06-24T12:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">eGFR 29. Metformin stopped.</ref> Pt informed.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-33367",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "stop_reason": "other",
    "reason_text": "eGFR 29",
    "visit_id": "V-2026-062435"
  }
}
```
