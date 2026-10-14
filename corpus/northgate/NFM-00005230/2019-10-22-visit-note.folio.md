---
folio: "0.1"
id: "01DQTHG610D7D7TBGGNS5NCNRG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00005230"
effective: "2019-10-22T11:50:00-05:00"
recorded: "2019-10-22T15:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care.
BP 150/88, repeat 148/85. Pulse 81, wt 190 lb.
Labs from 10/20: eGFR 70, K 4.2, A1c 7.7%.
Hx of HTN, DM2 and lipids reviewed per pt, added to problem list.
RTC to recheck BP and review labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-102222",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-102222",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
