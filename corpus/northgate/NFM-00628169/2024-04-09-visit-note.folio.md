---
folio: "0.1"
id: "01HV2QQAP0Y680V9GB3H7MEBAP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00628169"
effective: "2024-04-09T13:30:00-05:00"
recorded: "2024-04-09T19:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.
BP 117/68, pulse 72, wt 193 lb.
eGFR 40, K 3.6, UACR 434 mg/g, A1c 7.7% today.
Went over results with pt.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040946",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040946",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
