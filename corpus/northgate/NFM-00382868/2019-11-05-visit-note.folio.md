---
folio: "0.1"
id: "01DRZCXWD0HC3164BWA2YGS6AC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00382868"
effective: "2019-11-05T15:15:00-06:00"
recorded: "2019-11-05T21:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt, records to follow.
BP 130/82, pulse 79, wt 207 lb.
Labs 11/1: eGFR 81, A1c 7.2%, LDL 81 mg/dL.
Problem list entered today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-110587",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-110587",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-110587",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
