---
folio: "0.1"
id: "01KKM9CWV0NB3JMGB7WQTZA8W7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00040235"
effective: "2026-03-13T08:15:00-05:00"
recorded: "2026-03-13T14:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes f/u.

BP 130/75, pulse 77, wt 171 lb.

Labs 3/8: eGFR 87, A1c 8.1%, LDL 47 mg/dL.

A1c up, metformin dose changed to 1000 mg twice daily today. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-031346",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
