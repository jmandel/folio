---
folio: "0.1"
id: "01GRYC8G50TGE2SDV1YTCM9KBD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2023-02-10T11:40:00-06:00"
recorded: "2023-02-10T13:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "visit_id": "V-2023-021082",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-021082",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-021082",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
