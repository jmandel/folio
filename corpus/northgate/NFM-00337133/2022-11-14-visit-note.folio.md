---
folio: "0.1"
id: "01GHW2QC40EN0Y00AXMV4WNQ7D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00337133"
effective: "2022-11-14T11:45:00-06:00"
recorded: "2022-11-14T16:04:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints today.
BP 131/73, pulse 73, wt 174 lb.
Labs 11/10: eGFR 90, K 4.4, A1c 7.1%, LDL 157 mg/dL.
Went over results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-111493",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-111493",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-111493",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
