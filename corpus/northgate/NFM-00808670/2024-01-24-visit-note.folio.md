---
folio: "0.1"
id: "01HMYBRX20WNBD11FXDPB0SY4J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00808670"
effective: "2024-01-24T09:00:00-06:00"
recorded: "2024-01-24T12:30:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 146/86, pulse 66, wt 222 lb.
eGFR 58, K 4.4, UACR 77 mg/g today. CKD stage 3a added to problem list.
BP still above goal: chlorthalidone started 12.5 mg daily today.
Pt tolerating visit well, no new complaints.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-012421",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-012421",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
