---
folio: "0.1"
id: "01G89NYAF09X7JE2GF8DVZ9FBS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00952210"
effective: "2022-07-18T10:45:00-05:00"
recorded: "2022-07-18T17:13:00-05:00"
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

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071818",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-071818",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
