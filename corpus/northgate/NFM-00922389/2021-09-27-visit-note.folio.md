---
folio: "0.1"
id: "01FGMFRQ80CBF0G2XH5Z3T6GT7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922389"
effective: "2021-09-27T10:00:00-05:00"
recorded: "2021-09-27T15:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

dulaglutide: started 0.5 mg weekly today (A1c 8.5)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092747",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-092747",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-092747",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
