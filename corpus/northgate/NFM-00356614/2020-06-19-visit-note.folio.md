---
folio: "0.1"
id: "01EB6VSH80J9684BVW1JQD2KDC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2020-06-19T11:00:00-05:00"
recorded: "2020-06-19T13:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

lisinopril: stopped today (dry cough)

losartan: started 50 mg daily today (ACE inhibitor cough)

lisinopril intolerance: dry cough

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-061966",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-061966",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-061966",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
