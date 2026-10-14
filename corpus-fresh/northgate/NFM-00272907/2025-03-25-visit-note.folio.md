---
folio: "0.1"
id: "01JQ7EF6W056Y6E2HBHN2674FW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00272907"
effective: "2025-03-25T09:00:00-05:00"
recorded: "2025-03-25T15:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new concerns.
BP 118/77, pulse 79, wt 174 lb.
Exam unremarkable. Reviewed diet and activity.
RTC 1 yr, sooner prn.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-032513",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-032513",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
