---
folio: "0.1"
id: "01DVVGMNE0YXXECMQ9MHK6XB1E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673781"
effective: "2019-12-11T13:15:00-06:00"
recorded: "2019-12-11T16:18:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN, DM2 and obesity per pt.
BP 147/88, repeat 140/88. Pulse 84, wt 213 lb.
Labs today: eGFR 71, K 4.5, UACR 14 mg/g, A1c 7.4%, LDL 112 mg/dL.
Problem list built from pt history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-121132",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-121132",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-121132",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
