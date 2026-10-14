---
folio: "0.1"
id: "01HNXBP7Q0H6H8V69B3YKYB5TY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00861623"
effective: "2024-02-05T08:30:00-06:00"
recorded: "2024-02-05T13:25:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

dapagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-020597",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-020597",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-020597",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
