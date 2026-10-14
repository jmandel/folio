---
folio: "0.1"
id: "01HYE4FJXG5SA0YV9FRZDJ39VH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00871242"
effective: "2024-05-21T12:51:00-05:00"
recorded: "2024-05-21T12:51:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start empagliflozin: CKD + DM, cardiorenal benefit.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-41810",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "CKD + DM, cardiorenal benefit",
    "visit_id": "V-2024-052154"
  }
}
```
