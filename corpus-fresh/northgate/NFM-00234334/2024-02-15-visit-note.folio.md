---
folio: "0.1"
id: "01HPQHXBJ0M3FXZ3SA8KRK942N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00234334"
effective: "2024-02-15T12:45:00-06:00"
recorded: "2024-02-15T17:34:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for acute kidney injury. Feels back to baseline, eating and drinking normally.
BP 146/78, pulse 81, wt 185 lb.
Losartan resumed today (creatinine back to baseline).
Recheck labs in 2 wk. RTC 1 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-021537",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-021537",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
