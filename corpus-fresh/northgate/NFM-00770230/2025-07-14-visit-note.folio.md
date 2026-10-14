---
folio: "0.1"
id: "01K0580NY0DX23T8JVM9E9HC0Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770230"
effective: "2025-07-14T09:00:00-05:00"
recorded: "2025-07-14T14:54:00-05:00"
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
BP 139/78, pulse 74, wt 173 lb.
furosemide: resumed today (creatinine back to baseline). losartan: resumed today (creatinine back to baseline).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-071444",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-071444",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
