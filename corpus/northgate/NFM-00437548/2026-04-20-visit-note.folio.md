---
folio: "0.1"
id: "01KPPD8BP0NDVAA5JER3CX2D10"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00437548"
effective: "2026-04-20T14:00:00-05:00"
recorded: "2026-04-20T16:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.

BP 121/72, pulse 87, wt 251 lb.
Labs 4/16: eGFR 80, UACR 61 mg/g, A1c 6.7%, LDL 67 mg/dL.

Exam unremarkable. Labs reviewed with pt, no changes today.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-042043",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-042043",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-042043",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
