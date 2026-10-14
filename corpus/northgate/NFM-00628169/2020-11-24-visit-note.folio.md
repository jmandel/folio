---
folio: "0.1"
id: "01EQY79RM0E06TEXK6X4EFYNF1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00628169"
effective: "2020-11-24T11:10:00-06:00"
recorded: "2020-11-24T16:52:00-06:00"
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

dulaglutide: started 0.5 mg weekly today (A1c 8.2)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-112464",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-112464",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-112464",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
