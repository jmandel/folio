---
folio: "0.1"
id: "01K05CPTM0NV0FDZB9HSASKMT6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00422231"
effective: "2025-07-14T13:50:00-05:00"
recorded: "2025-07-14T16:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 129/79, pulse 73, wt 181 lb.

Labs today: eGFR 71, K 4.2, UACR 111 mg/g, A1c 7%, LDL 92 mg/dL.

Pt doing well. Reviewed results with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-071455",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-071455",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-071455",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
