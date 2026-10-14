---
folio: "0.1"
id: "01H696Y6FGFQFBAN27QZK2RMR1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00297636"
effective: "2023-07-26T08:41:00-05:00"
recorded: "2023-07-26T08:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start empagliflozin: A1c 8.6.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-38903",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.6",
    "visit_id": "V-2023-072645"
  }
}
```
