---
folio: "0.1"
id: "01FZXNM610X13RZZTTHYEV60NE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00437548"
effective: "2022-04-05T10:20:00-05:00"
recorded: "2022-04-05T15:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Labs 4/3: A1c 8.3%, eGFR 84, K 3.8, UACR 63 mg/g, LDL 81 mg/dL.

BP 129/81, pulse 71, wt 253 lb.

Empagliflozin started 10 mg daily today (A1c 8.3). Reviewed what to expect and when to call.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-040521",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-040521",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
