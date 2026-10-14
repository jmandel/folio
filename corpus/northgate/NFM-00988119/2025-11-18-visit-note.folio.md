---
folio: "0.1"
id: "01KACESC80RF92XBA3W7VY7RJ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00988119"
effective: "2025-11-18T10:50:00-06:00"
recorded: "2025-11-18T15:44:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

empagliflozin: started 10 mg daily today (A1c above goal)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-111835",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-111835",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
