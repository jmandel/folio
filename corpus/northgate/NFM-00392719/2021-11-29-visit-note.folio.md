---
folio: "0.1"
id: "01FNPCGDC0919AWAQBAAQB6M5X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2021-11-29T09:15:00-06:00"
recorded: "2021-11-29T11:40:00-06:00"
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

insulin glargine: started 10 units at bedtime today (A1c 8.1)

losartan: dose changed to 100 mg daily today (BP above goal)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-112997",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-112997",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
