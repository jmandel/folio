---
folio: "0.1"
id: "01JZ6SHTC0JAR53HJ34ECE8G8S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00568295"
effective: "2025-07-02T13:00:00-05:00"
recorded: "2025-07-02T19:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u, acute kidney injury. Feels back to baseline, eating and drinking normally.
BP 143/78, repeat 136/78, pulse 71, wt 215 lb.
Lisinopril resumed today (creatinine back to baseline).
RTC 3 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-070299",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-070299",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
