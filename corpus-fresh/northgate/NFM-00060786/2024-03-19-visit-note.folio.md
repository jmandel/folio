---
folio: "0.1"
id: "01HSC3VY00PXQNH901JB2K648X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00060786"
effective: "2024-03-19T09:15:00-05:00"
recorded: "2024-03-19T14:44:00-05:00"
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

BP 140/78, repeat 136/74, pulse 72, wt 179 lb.

Lisinopril stopped today (AKI with hyperkalemia). Pt agrees.

RTC for BP check and repeat labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031995",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031995",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
