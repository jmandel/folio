---
folio: "0.1"
id: "01KB3E48H0221BRNJGPWAN9RJ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00701178"
effective: "2025-11-27T09:45:00-06:00"
recorded: "2025-11-27T13:55:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u. Admitted with acute kidney injury. Feels back to baseline, eating and drinking normally.
BP 152/78, pulse 88, wt 236 lb.
Losartan resumed today (creatinine back to baseline). Chlorthalidone resumed today (creatinine back to baseline).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-112723",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-112723",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
