---
folio: "0.1"
id: "01K5ZA1800X227SHK4QMTKYPQF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00952210"
effective: "2025-09-24T15:50:00-05:00"
recorded: "2025-09-24T21:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092437",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-092437",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
