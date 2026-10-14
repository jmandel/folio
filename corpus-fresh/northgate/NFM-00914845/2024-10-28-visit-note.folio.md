---
folio: "0.1"
id: "01JBA72BC03H8YFN5MQYA5MPY2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00914845"
effective: "2024-10-28T10:00:00-05:00"
recorded: "2024-10-28T13:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing OK, no new symptoms.
BP 112/68, pulse 87, wt 301 lb.
10/23 labs: eGFR 88, K 3.9.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-102855",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
