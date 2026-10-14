---
folio: "0.1"
id: "01ECP20J30BJ17J0VVZA367GR7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2020-07-07T15:40:00-05:00"
recorded: "2020-07-07T20:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No hypoglycemia or new symptoms.
BP 125/76, pulse 81, wt 202 lb.
Labs today: eGFR 71, K 3.8, A1c 8%.
A1c up from last check, reviewed diet and activity with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-070762",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-070762",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
