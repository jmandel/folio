---
folio: "0.1"
id: "01K3HTKT70C481KN7P9WH6D2NB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00125465"
effective: "2025-08-25T14:40:00-05:00"
recorded: "2025-08-25T18:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

chlorthalidone: started 12.5 mg daily today (BP above goal)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-082561",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-082561",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
