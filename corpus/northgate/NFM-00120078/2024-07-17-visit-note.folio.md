---
folio: "0.1"
id: "01J31NXYK0C3V08QCKKKHN9BSV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00120078"
effective: "2024-07-17T15:40:00-05:00"
recorded: "2024-07-17T20:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing well, no new symptoms.
BP 121/69, pulse 62, wt 209 lb.
eGFR 70 on 7/14.
Plan unchanged. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-071777",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
