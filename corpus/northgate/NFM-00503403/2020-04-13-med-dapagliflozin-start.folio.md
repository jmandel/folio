---
folio: "0.1"
id: "01E5T2YZRGCRZSSJYVPBE8M61P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00503403"
effective: "2020-04-13T10:36:00-05:00"
recorded: "2020-04-13T10:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.6, CKD. Started dapagliflozin 10 mg daily today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43269",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.6, CKD",
    "visit_id": "V-2020-041322"
  }
}
```
