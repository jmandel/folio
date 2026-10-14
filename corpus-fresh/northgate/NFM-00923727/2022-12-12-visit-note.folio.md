---
folio: "0.1"
id: "01GM4AQ4K0DKZ6SAQJR805ASC4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00923727"
effective: "2022-12-12T11:30:00-06:00"
recorded: "2022-12-12T17:29:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 121/66, pulse 72, wt 212 lb.

Labs 12/6: eGFR 74, K 4.5, A1c 8.3%, LDL 59 mg/dL, UACR 435 mg/g.

Dapagliflozin: started 10 mg daily today (A1c 8.3). Reviewed what to expect with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-121278",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-121278",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-121278",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
