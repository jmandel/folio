---
folio: "0.1"
id: "01HMVQRXE0SG5987ZMD44JEZ0N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00899321"
effective: "2024-01-23T09:40:00-06:00"
recorded: "2024-01-23T12:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP follow-up.

Patient ran out of losartan about 3 weeks ago and has not been taking it.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-012317",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-012317",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
