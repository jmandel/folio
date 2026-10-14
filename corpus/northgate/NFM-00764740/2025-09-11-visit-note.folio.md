---
folio: "0.1"
id: "01K4XJ97Y0AJJE6SY3D8E0W9R3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00764740"
effective: "2025-09-11T13:50:00-05:00"
recorded: "2025-09-11T18:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u visit. Pt reports no new problems.

BP 121/72, pulse 71, wt 207 lb.

eGFR 60 today. Reviewed with pt.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091159",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-091159",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
