---
folio: "0.1"
id: "01FTCAEBA0STZPPQ421ZF9G98B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00039111"
effective: "2022-01-26T15:15:00-06:00"
recorded: "2022-01-26T17:10:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 122/77, pulse 67, wt 246 lb.

Labs from 1/20: eGFR 55, K 4.1, UACR 457 mg/g, A1c 7.1%.

Problem list built from pt's history today. RTC to go over labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-012625",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-012625",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
