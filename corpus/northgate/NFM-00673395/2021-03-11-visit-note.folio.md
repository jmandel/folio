---
folio: "0.1"
id: "01F0HCCEW07G819NMPEP8WMPY2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673395"
effective: "2021-03-11T10:45:00-06:00"
recorded: "2021-03-11T13:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 136/86, pulse 72, wt 155 lb.
Labs 3/9: eGFR 47, K 3.9, A1c 8.1%, LDL 125.
A1c up, so metformin changed to 1000 mg BID today.
Diet and activity reviewed. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-031126",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-031126",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-031126",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
