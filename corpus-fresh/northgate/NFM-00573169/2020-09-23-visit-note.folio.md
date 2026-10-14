---
folio: "0.1"
id: "01EJYAY0F0WS1AMKG552Y5VTG3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00573169"
effective: "2020-09-23T10:00:00-05:00"
recorded: "2020-09-23T15:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 150/85, pulse 70, wt 194 lb.
eGFR 42, K 4.7, A1c 7.7% today.
CKD stage 3b added to problem list.
BP above goal: chlorthalidone started 12.5 mg daily today.
RTC 3 mo, recheck BP and labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-092358",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-092358",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-092358",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-092358",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
