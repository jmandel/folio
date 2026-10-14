---
folio: "0.1"
id: "01FCVZCSF0A8GMMF5AXW6G89ST"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2021-08-11T14:10:00-05:00"
recorded: "2021-08-11T20:25:00-05:00"
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

insulin glargine: dose changed to 14 units at bedtime today (A1c 8.4)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-081139",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-081139",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-081139",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
