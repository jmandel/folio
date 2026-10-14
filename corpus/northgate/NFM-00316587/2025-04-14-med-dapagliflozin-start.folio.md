---
folio: "0.1"
id: "01JRTRJ8QG1NWX6MGMREEHTS0T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00316587"
effective: "2025-04-14T13:21:00-05:00"
recorded: "2025-04-14T13:21:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Dapagliflozin 10 mg daily started today for A1c 8.2 and CKD.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-41048",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.2, CKD",
    "visit_id": "V-2025-041444"
  }
}
```
