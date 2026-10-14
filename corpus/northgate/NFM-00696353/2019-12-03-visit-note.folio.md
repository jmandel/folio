---
folio: "0.1"
id: "01DV6Z0BF04CXCTBX7JYZ6D2R1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696353"
effective: "2019-12-03T10:50:00-06:00"
recorded: "2019-12-03T16:45:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 128/71, pulse 63, wt 169 lb.

Labs 11/27: eGFR 38, K 5.2, A1c 6.6%.

Metformin down to 500 mg BID today (eGFR 39).

Questions answered. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-120347",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-120347",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-120347",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
