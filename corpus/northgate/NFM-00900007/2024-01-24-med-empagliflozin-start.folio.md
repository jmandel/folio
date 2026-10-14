---
folio: "0.1"
id: "01HMYP5KHG975JSXFYJ6RK2EZX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900007"
effective: "2024-01-24T15:31:00-06:00"
recorded: "2024-01-24T15:31:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start empagliflozin: HFrEF.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-39894",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "HFrEF",
    "visit_id": "V-2024-012489"
  }
}
```
