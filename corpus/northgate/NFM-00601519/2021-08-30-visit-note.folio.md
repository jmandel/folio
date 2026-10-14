---
folio: "0.1"
id: "01FECHG7Q06QCFSPZJXWJTKVJQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2021-08-30T12:20:00-05:00"
recorded: "2021-08-30T17:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

metformin: dose changed to 500 mg twice daily today (eGFR 45)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-083019",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-083019",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-083019",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
