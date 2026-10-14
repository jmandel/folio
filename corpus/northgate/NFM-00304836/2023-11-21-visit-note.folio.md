---
folio: "0.1"
id: "01HFT2MR9001GFPVGPPF4WEZ8P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00304836"
effective: "2023-11-21T12:50:00-06:00"
recorded: "2023-11-21T17:15:00-06:00"
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

dulaglutide: started 0.5 mg weekly today (A1c 9.1)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-112137",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-112137",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-112137",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
