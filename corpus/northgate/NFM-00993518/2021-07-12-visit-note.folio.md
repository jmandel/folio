---
folio: "0.1"
id: "01FAE86AY0CES26VA446HZTT8J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00993518"
effective: "2021-07-12T13:30:00-05:00"
recorded: "2021-07-12T15:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

lisinopril: stopped today (dry cough)

losartan: started 50 mg daily today (ACE inhibitor cough)

lisinopril intolerance: dry cough

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-071278",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-071278",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-071278",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
