---
folio: "0.1"
id: "01JEVQ4HN0S79Z3X2XEGB5ZMPX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00920167"
effective: "2024-12-11T11:20:00-06:00"
recorded: "2024-12-11T14:39:00-06:00"
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

dulaglutide: started 0.5 mg weekly today (A1c 8.7)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-121168",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-121168",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
