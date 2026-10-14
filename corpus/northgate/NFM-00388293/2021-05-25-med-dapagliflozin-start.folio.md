---
folio: "0.1"
id: "01F6JM5ZVGZBR960RGMXV5TRGS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00388293"
effective: "2021-05-25T15:41:00-05:00"
recorded: "2021-05-25T15:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Dapagliflozin 10 mg daily started today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-24759",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2021-052577"
  }
}
```
