---
folio: "0.1"
id: "01J83BGRG0NDNAGHBZSE44QHHS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00586366"
effective: "2024-09-18T08:50:00-05:00"
recorded: "2024-09-18T15:00:00-05:00"
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

BP 127/72, pulse 79, wt 227 lb.

Labs from 9/16: eGFR 66, K 4, LDL 94 mg/dL.

Problem list entered from pt history. RTC to be scheduled.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091893",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-091893",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
