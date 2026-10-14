---
folio: "0.1"
id: "01EG3VMFA085P7CENPPPNTA5GD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2020-08-19T10:40:00-05:00"
recorded: "2020-08-19T12:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 128/87, pulse 72, wt 131 lb.
Labs 8/15: A1c 7%, eGFR 63, K 3.8, UACR 735 mg/g.
Will recheck labs next visit.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-081941",
    "visit_type": "office",
    "reason": "Chronic care visit"
  }
}
```
