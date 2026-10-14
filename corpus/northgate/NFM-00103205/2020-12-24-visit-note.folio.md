---
folio: "0.1"
id: "01ETBAFBB00161CHW599K2SGD2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2020-12-24T10:30:00-06:00"
recorded: "2020-12-24T15:29:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c still above goal.
BP 129/82, pulse 82, wt 202 lb.
Labs today: eGFR 71, K 4.6, UACR 238 mg/g, A1c 8.3%.
Started semaglutide 0.5 mg weekly today. Pt taught injection and what side effects to watch for.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-122462",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-122462",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-122462",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
