---
folio: "0.1"
id: "01H2RVGDS017FZ88BZ1VFJFJ3R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172148"
effective: "2023-06-12T11:50:00-05:00"
recorded: "2023-06-12T17:27:00-05:00"
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

losartan: held today (K 5.7 confirmed on repeat); review 2023-06-26

lisinopril intolerance: dry cough

Patient ran out of amlodipine about 3 weeks ago and has not been taking it.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-061262",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-061262",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-061262",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
