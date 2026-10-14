---
folio: "0.1"
id: "01DNG7BQ60V8ETCNM5HA2SM4KR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00017276"
effective: "2019-09-23T13:45:00-05:00"
recorded: "2019-09-23T18:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 132/81, pulse 64, wt 222 lb.
Labs 9/17: eGFR 41, K 4.6, A1c 8.2%. CKD stage 3b on problem list.
Empagliflozin started 10 mg daily today (A1c 8.2, CKD).
Pt feels well, no new complaints.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-092338",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-092338",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-092338",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2019-092338",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
