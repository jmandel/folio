---
folio: "0.1"
id: "01KMGFRM9083H8EMXMYTFV4X4C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00120078"
effective: "2026-03-24T08:50:00-05:00"
recorded: "2026-03-24T12:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new concerns per pt.
BP 119/69, pulse 62, wt 207 lb.
eGFR 67 today.
Reviewed results with pt, plan unchanged.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-032457",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-032457",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-032457",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
