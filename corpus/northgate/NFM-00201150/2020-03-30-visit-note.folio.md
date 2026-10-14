---
folio: "0.1"
id: "01E4PK38T0J3DNMGJZ3XBY4THG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2020-03-30T12:50:00-05:00"
recorded: "2020-03-30T15:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new symptoms.
BP 144/83, repeat 137/81, pulse 73, wt 179 lb.
3/27 labs: eGFR 66, K 4.9, UACR 68 mg/g, A1c 7.8%.
Will recheck BP at next visit.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-033043",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-033043",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-033043",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
