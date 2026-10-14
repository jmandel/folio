---
folio: "0.1"
id: "01FJA8X0N028Q4CP24GM6PNHH6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2021-10-18T08:50:00-05:00"
recorded: "2021-10-18T12:59:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well, no new symptoms.
BP 121/73, pulse 83, wt 203 lb.
Labs today: eGFR 70, K 4.2, A1c 7.5%.
<ref id="sick_day">Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink.</ref>
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-101879",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-101879",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-101879",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
