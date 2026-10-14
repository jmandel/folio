---
folio: "0.1"
id: "01F4J709C00N9P9VK51PCHRSFM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00628169"
effective: "2021-04-30T11:20:00-05:00"
recorded: "2021-04-30T15:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c still above goal.
BP 125/73, pulse 75, wt 193 lb.
eGFR 49, K 4.1, UACR 279 mg/g, A1c 8.3%, LDL 88 today.
Insulin glargine started 10 units at bedtime today (A1c 8.3). Reviewed injection technique and low sugar symptoms.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-043059",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-043059",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
