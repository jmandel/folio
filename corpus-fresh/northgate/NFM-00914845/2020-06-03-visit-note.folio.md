---
folio: "0.1"
id: "01E9YK2GT0FDDSTT1476W4QFAG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00914845"
effective: "2020-06-03T15:30:00-05:00"
recorded: "2020-06-03T21:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.
BP 115/73, pulse 73, wt 302 lb.
Labs today: eGFR 85, K 4.2, LDL 142 mg/dL.
Discussed results with pt, questions answered.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-060397",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
