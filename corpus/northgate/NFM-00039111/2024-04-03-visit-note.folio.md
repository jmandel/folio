---
folio: "0.1"
id: "01HTK1NN40YD3W0AQ36N011DVK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00039111"
effective: "2024-04-03T15:00:00-05:00"
recorded: "2024-04-03T17:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

metformin: dose changed to 1000 mg twice daily today (A1c 8.2)

empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040351",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040351",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-040351",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-040351",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
