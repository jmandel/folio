---
folio: "0.1"
id: "01G6X9X1C08H0MS28XNVHM33ZM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2022-07-01T08:00:00-05:00"
recorded: "2022-07-01T11:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 124/71, pulse 71, wt 176 lb.
Labs 6/25: A1c 8.1%, eGFR 64, K 4.2, UACR 549 mg/g.
Insulin glargine started 10 units at bedtime today for A1c 8.1.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-070114",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-070114",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-070114",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
