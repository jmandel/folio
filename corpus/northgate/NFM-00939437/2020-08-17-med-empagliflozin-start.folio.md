---
folio: "0.1"
id: "01EFYF1EZGPWSSZ51NAWSY57N1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939437"
effective: "2020-08-17T10:01:00-05:00"
recorded: "2020-08-17T10:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start empagliflozin: A1c 9.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-38665",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 9",
    "visit_id": "V-2020-081793"
  }
}
```
