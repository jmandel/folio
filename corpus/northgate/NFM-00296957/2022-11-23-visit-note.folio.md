---
folio: "0.1"
id: "01GJKS7TW0Z1JEJPCBT401WWW0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2022-11-23T15:10:00-06:00"
recorded: "2022-11-23T21:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

insulin glargine: started 10 units at bedtime today (A1c 8.6)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-112351",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-112351",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
