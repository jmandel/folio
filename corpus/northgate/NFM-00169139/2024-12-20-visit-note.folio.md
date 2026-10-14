---
folio: "0.1"
id: "01JFJV5JM0AZKC513CQ8EXREQ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00169139"
effective: "2024-12-20T08:00:00-06:00"
recorded: "2024-12-20T14:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, acute kidney injury. Feels better, eating and drinking normally.

BP 135/78, pulse 82, wt 206 lb.

Creatinine back to baseline. Losartan resumed today. Furosemide resumed today. Hydrochlorothiazide stopped today (AKI with hyperkalemia).

RTC 2 wk.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-122071",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-122071",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
