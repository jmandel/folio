---
folio: "0.1"
id: "01GCARJG30GN6ZQ3R502WZ26KC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00487681"
effective: "2022-09-06T14:50:00-05:00"
recorded: "2022-09-06T20:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Patient ran out of losartan about 3 weeks ago and has not been taking it.

BP 145/94, pulse 65, wt 200 lb.

Labs today: eGFR 64, K 4.4, UACR 106 mg/g, A1c 7.9%.

RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-090684",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-090684",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-090684",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
