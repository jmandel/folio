---
folio: "0.1"
id: "01JHPKRQ50DD56ZTZE5FY9JM5S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140901"
effective: "2025-01-15T15:40:00-06:00"
recorded: "2025-01-15T21:51:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well per pt.

BP 121/73, pulse 81, wt 244 lb.
eGFR 64, K 4, A1c 7.7% today.

Reviewed with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-011599",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-011599",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
