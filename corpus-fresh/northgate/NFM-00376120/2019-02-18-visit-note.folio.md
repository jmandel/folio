---
folio: "0.1"
id: "01D4142BK0KZ0CN8NTPWC4073H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00376120"
effective: "2019-02-18T12:40:00-06:00"
recorded: "2019-02-18T14:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records reviewed with pt.
BP 128/77, pulse 64, wt 182 lb.
Labs 2/14: eGFR 73, K 4.7.
Pt gave history as above, no new complaints today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-021825",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-021825",
    "rank": 1,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-021825",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
