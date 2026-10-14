---
folio: "0.1"
id: "01DMXNBHF0WGV5R9Q3M43V6R4S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00206105"
effective: "2019-09-16T10:20:00-05:00"
recorded: "2019-09-16T13:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 134/85, pulse 68, wt 172 lb.
Labs today: eGFR 98, K 4.6, UACR 49 mg/g, A1c 7%, LDL 96 mg/dL.

Will review results with pt at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-091685",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-091685",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
