---
folio: "0.1"
id: "01K5A615E0ETMZBA8BKG244G01"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531163"
effective: "2025-09-16T13:50:00-05:00"
recorded: "2025-09-16T16:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new concerns.

BP 136/81, pulse 83, wt 184 lb.
Labs 9/10: eGFR 73, K 4.3, UACR 64 mg/g, A1c 6.2%, LDL 130 mg/dL.

Reviewed results with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091611",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-091611",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
