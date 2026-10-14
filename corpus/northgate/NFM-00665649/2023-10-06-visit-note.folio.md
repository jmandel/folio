---
folio: "0.1"
id: "01HC3TRRS08WJMZXZ4VZC0WAS5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2023-10-06T14:20:00-05:00"
recorded: "2023-10-06T20:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 137/75, pulse 84, wt 195 lb.
10/3 labs: eGFR 60, K 3.9, UACR 468 mg/g, A1c 7.1%.
UACR still elevated, will keep following.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-100694",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-100694",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-100694",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
