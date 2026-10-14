---
folio: "0.1"
id: "01J1B42MP0RNA8PQRAQG5ACHBB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00385057"
effective: "2024-06-26T09:10:00-05:00"
recorded: "2024-06-26T15:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 142/90, pulse 76, wt 147 lb.

Labs today: eGFR 75, K 4.4, UACR 666 mg/g, A1c 7.5%, LDL 135 mg/dL.

Problem list entered from pt history. Will go over labs at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062693",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-062693",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-062693",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
