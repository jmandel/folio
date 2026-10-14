---
folio: "0.1"
id: "01KM1JDZ707EEGB9G963R2B7P3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00036899"
effective: "2026-03-18T15:30:00-05:00"
recorded: "2026-03-18T17:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt doing well, no new symptoms.

BP 117/76, pulse 64, wt 185 lb.
Labs today: eGFR 49, K 4.8, UACR 18 mg/g, A1c 7%, LDL 79 mg/dL.
Results reviewed with pt.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-031846",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-031846",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-031846",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-031846",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2026-031846",
    "rank": 4,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
