---
folio: "0.1"
id: "01KKWC6RC067VSZM5BP83QGF33"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00330505"
effective: "2026-03-16T12:30:00-05:00"
recorded: "2026-03-16T17:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new concerns.
BP 125/70, pulse 75, wt 167 lb.
eGFR 60 today. Reviewed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-031631",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-031631",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
