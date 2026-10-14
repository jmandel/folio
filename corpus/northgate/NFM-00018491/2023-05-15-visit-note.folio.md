---
folio: "0.1"
id: "01H0G82EJ0ZGC9JXB3WCCETDXS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00018491"
effective: "2023-05-15T08:15:00-05:00"
recorded: "2023-05-15T12:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-051517",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-051517",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
