---
folio: "0.1"
id: "01GYBJ5T104JY8TFJDJZEDQXQ0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00993518"
effective: "2023-04-18T15:20:00-05:00"
recorded: "2023-04-18T20:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Doing OK overall.
BP 133/82, pulse 64, wt 203 lb.
Labs 4/13: eGFR 69, K 4.3, UACR 17 mg/g, A1c 8.5%.
A1c up. Semaglutide started 0.5 mg weekly today (A1c 8.5). Reviewed injection technique.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-041887",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-041887",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-041887",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-041887",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
