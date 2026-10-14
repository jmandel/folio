---
folio: "0.1"
id: "01EP58TNP0NAG1KT3QD6JQGXXA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2020-11-02T08:45:00-06:00"
recorded: "2020-11-02T14:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP up in office.
BP 148/95, repeat 140/91, pulse 75, wt 236 lb.
Labs 10/29: eGFR 63, K 4.8, A1c 7.8%.
Losartan dose changed to 100 mg daily today (BP above goal).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-110288",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-110288",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
