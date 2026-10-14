---
folio: "0.1"
id: "01HKX7RKV0KV7N18498X84NGWG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00577826"
effective: "2024-01-11T12:50:00-06:00"
recorded: "2024-01-11T15:45:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 124/74, pulse 74, wt 161 lb.

Labs today: eGFR 37, K 5, UACR 14 mg/g, LDL 114 mg/dL.

Will review results with pt and f/u. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-011193",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-011193",
    "rank": 1,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
