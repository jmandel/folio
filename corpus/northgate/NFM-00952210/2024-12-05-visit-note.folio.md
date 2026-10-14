---
folio: "0.1"
id: "01JEC3Q3D098RBA7QT7YFY3WN8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00952210"
effective: "2024-12-05T09:10:00-06:00"
recorded: "2024-12-05T13:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u visit. Feels well.

BP 111/67, pulse 63, wt 153 lb.
Labs today: eGFR 76, K 4.6, LDL 104 mg/dL. Reviewed with pt.
Diet and exercise reinforced. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-120512",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
