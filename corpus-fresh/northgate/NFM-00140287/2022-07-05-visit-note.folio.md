---
folio: "0.1"
id: "01G78DRBX0MKJ03GDB7JJPGBGH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2022-07-05T15:45:00-05:00"
recorded: "2022-07-05T19:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 155/94, repeat 147/90, pulse 84, wt 158 lb.
Labs 6/30: eGFR 39, K 4.8, UACR 270 mg/g, A1c 7.1%.
BP still above goal on repeat. Reviewed home BP checks and salt intake with pt.
RTC 2-3 mo for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-070546",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-070546",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-070546",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-070546",
    "rank": 3,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
