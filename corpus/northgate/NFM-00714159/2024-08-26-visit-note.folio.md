---
folio: "0.1"
id: "01J68CCJM0VN4PP2S0RYXVHQN0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00714159"
effective: "2024-08-26T15:10:00-05:00"
recorded: "2024-08-26T17:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt, outside records not yet in hand.

BP 130/74, pulse 80, wt 211 lb.

Labs from 8/23: eGFR 98, K 4.4, UACR 77 mg/g, A1c 6.2%, LDL 92 mg/dL.

Went over the 8/23 results with pt. Problem list entered today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-082611",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-082611",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-082611",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
