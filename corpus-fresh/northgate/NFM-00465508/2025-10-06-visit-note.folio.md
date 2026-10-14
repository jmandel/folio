---
folio: "0.1"
id: "01K6XWNRX0SEWYMM8QVHA4P39W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00465508"
effective: "2025-10-06T11:45:00-05:00"
recorded: "2025-10-06T18:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Feels well.

BP 136/77, pulse 77, wt 217 lb.
eGFR 93, K 4.1 today.

Labs stable, discussed with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-100645",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
