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
New pt, establishing care. No acute complaints.

BP 116/68, pulse 76, wt 171 lb.

Labs 12/2: eGFR 88, K 4.8, UACR 257 mg/g, A1c 6.9%, LDL 106 mg/dL.

Will go over results with pt, f/u in 3 mo.

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
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
