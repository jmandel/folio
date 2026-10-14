---
folio: "0.1"
id: "01HVSNB950Y9B7H9D21Z2QWCCB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00823780"
effective: "2024-04-18T15:50:00-05:00"
recorded: "2024-04-18T17:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN, DM2 and hyperlipidemia per pt.

BP 155/94, repeat 148/93. Pulse 65, wt 161 lb.

Labs 4/13: eGFR 50, K 4.9, A1c 6.4%, LDL 92 mg/dL.

Problem list updated. Will recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-041898",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-041898",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-041898",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
