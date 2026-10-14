---
folio: "0.1"
id: "01HAZPGMW0JRTNJ53N10ZC7H34"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00359511"
effective: "2023-09-22T15:15:00-05:00"
recorded: "2023-09-22T19:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

metformin: dose changed to 500 mg twice daily today (eGFR 42)

empagliflozin: started 10 mg daily today (A1c 8.5, CKD)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092272",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092272",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-092272",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
