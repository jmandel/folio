---
folio: "0.1"
id: "01JH1E3HC07EWVEF0CAW203GKZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00739733"
effective: "2025-01-07T13:40:00-06:00"
recorded: "2025-01-07T16:28:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Doing well, no new concerns.
BP 124/71, pulse 67, wt 186 lb.
eGFR 86 on 1/5, reviewed with pt.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-010734",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-010734",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
