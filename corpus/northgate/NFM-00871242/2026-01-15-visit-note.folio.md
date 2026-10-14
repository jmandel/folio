---
folio: "0.1"
id: "01KF20Y3W0PD79C3T2ZM9HA2M3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00871242"
effective: "2026-01-15T13:30:00-06:00"
recorded: "2026-01-15T17:48:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new complaints.
BP 123/75, pulse 88, wt 141 lb.
Reviewed meds and problem list, no changes today.
Diet and exercise reinforced.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-011531",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-011531",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
