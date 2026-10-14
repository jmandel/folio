---
folio: "0.1"
id: "01JGCPJ2NG9SFENKRRR5CFE1H2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00454123"
effective: "2024-12-30T15:11:00-06:00"
recorded: "2024-12-30T15:11:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dapagliflozin: HFrEF.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-30985",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488574" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "HFrEF",
    "visit_id": "V-2024-123086"
  }
}
```
