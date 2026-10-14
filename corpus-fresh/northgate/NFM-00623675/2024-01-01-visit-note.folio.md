---
folio: "0.1"
id: "01HK3X9HZ0E8M0Q914J5TWDCBJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00623675"
effective: "2024-01-01T14:30:00-06:00"
recorded: "2024-01-01T19:41:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, acute kidney injury. Feels better, eating and drinking OK.
BP 147/78, repeat 140/77. Pulse 67, wt 138 lb.
Lisinopril stopped today (AKI with hyperkalemia).
Referral to nephrology placed. Will recheck labs soon.
RTC 2-3 wk.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-010182",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-010182",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
