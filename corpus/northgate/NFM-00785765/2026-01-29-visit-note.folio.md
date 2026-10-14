---
folio: "0.1"
id: "01KG5M6DE0V6H8GV080KQTZRB4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2026-01-29T09:30:00-06:00"
recorded: "2026-01-29T13:38:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK.
BP 139/83, pulse 82, wt 221 lb.
Labs 1/25: eGFR 47, K 4.5, A1c 7.2%, LDL 106 mg/dL.
Reviewed results with pt, eGFR down again.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-012998",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-012998",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-012998",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-012998",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
