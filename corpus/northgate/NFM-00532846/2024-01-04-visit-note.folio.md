---
folio: "0.1"
id: "01HKBFNX30WBH01CH403GR2S3M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00532846"
effective: "2024-01-04T15:30:00-06:00"
recorded: "2024-01-04T18:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-010452",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-010452",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-010452",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
