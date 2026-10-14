---
folio: "0.1"
id: "01G9GBSH20KXYXZ935ET4GK7ZC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2022-08-02T12:00:00-05:00"
recorded: "2022-08-02T17:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt reports a dry cough.
BP 135/81, pulse 81, wt 220 lb. Labs today: A1c 7.9%, eGFR 57, K 4.7.
dapagliflozin: started 10 mg daily today (A1c above goal)
lisinopril: stopped today (dry cough)
losartan: started 50 mg daily today (ACE inhibitor cough)
lisinopril intolerance: dry cough
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-080251",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-080251",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-080251",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
