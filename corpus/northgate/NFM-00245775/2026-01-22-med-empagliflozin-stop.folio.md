---
folio: "0.1"
id: "01KFK3YEHGAVXGFZQD89KSEETD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00245775"
effective: "2026-01-22T09:07:00-06:00"
recorded: "2026-01-22T09:07:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">stop empagliflozin: euglycemic DKA.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-45934",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "euglycemic DKA",
    "visit_id": "V-2026-012227"
  }
}
```
