---
folio: "0.1"
id: "01HPJAA6F0TWE2N87QTB3SZC90"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00929295"
effective: "2024-02-13T13:00:00-06:00"
recorded: "2024-02-13T16:45:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care.
BP 159/96, pulse 76, wt 141 lb.
Labs 2/9: eGFR 75, K 4.6, UACR 46 mg/g, A1c 8%, LDL 122.
HTN, DM2 and hyperlipidemia added to problem list per pt history.
BP above goal today. Will recheck and review at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-021372",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-021372",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-021372",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
