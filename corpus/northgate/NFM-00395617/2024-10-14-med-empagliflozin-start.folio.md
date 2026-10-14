---
folio: "0.1"
id: "01JA68GS8GBT60C0B67M7388YY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395617"
effective: "2024-10-14T14:36:00-05:00"
recorded: "2024-10-14T14:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.2. Start empagliflozin 10 mg daily.</ref> Pt informed in clinic.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-27173",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2024-101419"
  }
}
```
