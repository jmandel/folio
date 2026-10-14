---
folio: "0.1"
id: "01GR4SE3K0BJPRDDM2QT2VNT65"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00128158"
effective: "2023-01-31T09:45:00-06:00"
recorded: "2023-01-31T14:49:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 128/76, pulse 72, wt 201 lb.
Labs today: A1c 7.7%, eGFR 68, K 4.4, UACR 10 mg/g.
A1c up a bit from last time. Pt feeling well.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-013166",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-013166",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
