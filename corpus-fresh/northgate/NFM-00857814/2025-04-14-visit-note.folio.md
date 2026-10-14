---
folio: "0.1"
id: "01JRTM25D08HG41KTDBMRF1JMG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00857814"
effective: "2025-04-14T08:45:00-05:00"
recorded: "2025-04-14T12:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new concerns.
BP 138/87, pulse 83, wt 202 lb.
Labs today: eGFR 62, K 4.6, UACR 191 mg/g, LDL 150 mg/dL.
Results reviewed with pt. RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041499",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-041499",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-041499",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-041499",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
