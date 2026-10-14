---
folio: "0.1"
id: "01JWCG31S0MZS1GZSTQS2RHT0S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2025-05-28T12:20:00-05:00"
recorded: "2025-05-28T17:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 126/71, pulse 65, wt 194 lb.
Labs 5/24: eGFR 56, K 4.5, A1c 7.6%.
CKD stage 3a now on the problem list. A1c up some, diet reviewed.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-052813",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-052813",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-052813",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
