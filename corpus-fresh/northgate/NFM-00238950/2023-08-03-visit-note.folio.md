---
folio: "0.1"
id: "01H6YGJ8T0A3NQ8H6VZZYBASVZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00238950"
effective: "2023-08-03T13:15:00-05:00"
recorded: "2023-08-03T15:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for acute kidney injury. Feels better, eating and drinking normally.
BP 141/78, pulse 87, wt 212 lb.
Lisinopril stopped today (AKI with hyperkalemia).
Pt understands to avoid it for now.
RTC 2 wks.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-080368",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-080368",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
