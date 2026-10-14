---
folio: "0.1"
id: "01H64BC3N026QF2JYXKRE2A5ZE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00128158"
effective: "2023-07-24T08:50:00-05:00"
recorded: "2023-07-24T11:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 134/86, pulse 87, wt 198 lb.
Labs today: A1c 8.1%, eGFR 67, K 4.2, UACR 10 mg/g, LDL 79 mg/dL.
Insulin glargine started 10 units at bedtime today (A1c 8.1). Reviewed pen technique with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-072414",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-072414",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-072414",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
