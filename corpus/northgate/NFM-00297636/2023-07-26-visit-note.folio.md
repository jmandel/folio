---
folio: "0.1"
id: "01H69Q18X0P07W4YNT08GN2V3A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00297636"
effective: "2023-07-26T08:20:00-05:00"
recorded: "2023-07-26T13:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

empagliflozin: started 10 mg daily today (A1c 8.6)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-072645",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-072645",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
