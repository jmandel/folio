---
folio: "0.1"
id: "01F0VE0TB0EM2Z2TKD44EYQGGT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2021-03-15T10:10:00-05:00"
recorded: "2021-03-15T12:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 127/76, pulse 76, wt 174 lb.

Labs 3/10: eGFR 65, K 4.3, UACR 75 mg/g, A1c 8.3%, LDL 161 mg/dL.

A1c 8.3, insulin glargine started 10 units at bedtime today. Taught pen use and hypoglycemia symptoms.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-031533",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-031533",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
