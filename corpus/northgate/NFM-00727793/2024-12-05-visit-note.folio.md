---
folio: "0.1"
id: "01JECNQWE0BZXR1A8P2FY9AEQA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727793"
effective: "2024-12-05T12:45:00-06:00"
recorded: "2024-12-05T18:26:00-06:00"
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

empagliflozin: started 10 mg daily today (HFrEF)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-120578",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-120578",
    "rank": 1,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
