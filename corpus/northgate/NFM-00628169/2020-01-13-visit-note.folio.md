---
folio: "0.1"
id: "01DYG90AC0YX8TP7AG2J9PBHPR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00628169"
effective: "2020-01-13T12:00:00-06:00"
recorded: "2020-01-13T14:20:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

dapagliflozin: started 10 mg daily today (A1c 8.8, CKD)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-011355",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-011355",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
