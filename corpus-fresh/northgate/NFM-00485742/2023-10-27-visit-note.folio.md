---
folio: "0.1"
id: "01HDS806P0ETNKA8PRV0B407Q6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00485742"
effective: "2023-10-27T12:10:00-05:00"
recorded: "2023-10-27T13:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels fine.
BP 148/92, pulse 80, wt 234 lb.
Today: eGFR 53, K 4, UACR 264 mg/g, A1c 7.4%.
BP up today, discussed home BP checks with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-102781",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-102781",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-102781",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
