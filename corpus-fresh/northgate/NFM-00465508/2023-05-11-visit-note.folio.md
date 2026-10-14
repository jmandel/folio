---
folio: "0.1"
id: "01H05X5EX0PJKQD9F8B49YK85W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00465508"
effective: "2023-05-11T10:15:00-05:00"
recorded: "2023-05-11T12:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing well, no new complaints.

BP 129/76, pulse 83, wt 218 lb. eGFR 96 today.

Wt stable. Reviewed diet and exercise. RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-051118",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-051118",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
