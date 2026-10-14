---
folio: "0.1"
id: "01DS3R15T0V7TYK1TB8C57H8V1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258113"
effective: "2019-11-07T11:10:00-06:00"
recorded: "2019-11-07T14:14:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 131/79, pulse 77, wt 164 lb.
Labs 11/1: eGFR 64, K 4.4, A1c 7.7%.
Reviewed diet and activity. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-110798",
    "visit_type": "office",
    "reason": "Chronic care visit"
  }
}
```
