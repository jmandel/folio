---
folio: "0.1"
id: "01KABZ6S5GTZ7597RFF8JHPSZM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00988119"
effective: "2025-11-18T11:11:00-06:00"
recorded: "2025-11-18T11:11:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start empagliflozin: A1c above goal.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-37831",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c above goal",
    "visit_id": "V-2025-111833"
  }
}
```
