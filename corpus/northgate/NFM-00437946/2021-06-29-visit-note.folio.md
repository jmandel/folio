---
folio: "0.1"
id: "01F9CH7Z605MN8Q5KTXT9GXHV4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00437946"
effective: "2021-06-29T11:15:00-05:00"
recorded: "2021-06-29T13:42:00-05:00"
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

semaglutide: started 0.5 mg weekly today (A1c 8.3)

lisinopril: dose changed to 40 mg daily today (BP above goal)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-062918",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-062918",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-062918",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-062918",
    "rank": 3,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2021-062918",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
