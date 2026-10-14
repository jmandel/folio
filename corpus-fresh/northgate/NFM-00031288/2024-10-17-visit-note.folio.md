---
folio: "0.1"
id: "01JAEBD0Z00MX7S45ZCAN25QX4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00031288"
effective: "2024-10-17T14:00:00-05:00"
recorded: "2024-10-17T18:01:00-05:00"
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
BP 154/78, pulse 77, wt 185 lb.
Lisinopril stopped today (AKI with hyperkalemia).
RTC 2 wk.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-101711",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-101711",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
