---
folio: "0.1"
id: "01J3DJA88GVVDEA3PGT02V0HKB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00998525"
effective: "2024-07-22T10:52:00-05:00"
recorded: "2024-07-22T10:52:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Empagliflozin stopped today (euglycemic DKA).</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-44147",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "euglycemic DKA",
    "visit_id": "V-2024-072243"
  }
}
```
