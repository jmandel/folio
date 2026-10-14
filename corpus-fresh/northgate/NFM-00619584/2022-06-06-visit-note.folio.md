---
folio: "0.1"
id: "01G4XBDBX0P3Y5NAM4GCZFDRXB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00619584"
effective: "2022-06-06T11:50:00-05:00"
recorded: "2022-06-06T15:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records and history reviewed with pt.

BP 130/83, pulse 73, wt 214 lb.

Labs from 5/31: eGFR 82, K 4.8, LDL 107 mg/dL.

Pt has no new complaints today. RTC to review as scheduled.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-060626",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-060626",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-060626",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
