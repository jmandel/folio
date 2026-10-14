---
folio: "0.1"
id: "01DT32PR30TDETA8018CGYEY7E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2019-11-19T13:10:00-06:00"
recorded: "2019-11-19T18:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt, problem list entered.
BP 130/81, pulse 82, wt 216 lb.
Labs 11/17: A1c 8.1%, eGFR 71, K 4.5.
A1c above goal, so insulin glargine started 10 units at bedtime today.
Reviewed how to use the pen and low sugar symptoms. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-111963",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-111963",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
