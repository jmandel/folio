---
folio: "0.1"
id: "01JDMEG6QGZSBDVXQVXE8Z30B0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212854"
effective: "2024-11-26T08:37:00-06:00"
recorded: "2024-11-26T08:37:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">stop dapagliflozin: euglycemic DKA.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-40600",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488574" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "euglycemic DKA",
    "visit_id": "V-2024-112627"
  }
}
```
